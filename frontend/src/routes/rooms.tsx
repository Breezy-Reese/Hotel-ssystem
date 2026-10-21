
import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { toast } from "sonner";
import { ImagePlus, LoaderCircle, Upload } from "lucide-react";

import { ModulePage } from "@/components/module-page";
import {
  LiveDataTable,
  type LiveColumn,
} from "@/components/live-data-table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { api, ApiError } from "@/lib/api";
import { branchesApi, roomsApi } from "@/lib/resources";
import type { Room, RoomStatus, RoomType } from "@/lib/types";
import { formatCurrency } from "../lib/currency";

export const Route = createFileRoute("/rooms")({
  head: () => ({
    meta: [
      { title: "Room Management — Aurelia Suites" },
      {
        name: "description",
        content: "Manage hotel rooms, pricing, amenities and photographs.",
      },
    ],
  }),
  component: RoomsPage,
});

const roomTypes: RoomType[] = [
  "Single",
  "Double",
  "Deluxe",
  "Executive",
  "Suite",
];

const statusVariant: Record<
  RoomStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  Available: "default",
  Reserved: "secondary",
  Occupied: "outline",
  Cleaning: "secondary",
  Maintenance: "destructive",
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_FILES = 8;
const MAX_ROOM_IMAGES = 20;

const acceptedImageTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

function RoomPhotos({ room }: { room: Room }) {
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const images =
    (room as Room & { images?: string[] }).images ?? [];

  async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const files = Array.from(input.files ?? []);
    input.value = "";

    if (!files.length) return;

    if (files.length > MAX_FILES) {
      toast.error(`Upload a maximum of ${MAX_FILES} photos at a time.`);
      return;
    }

    if (images.length + files.length > MAX_ROOM_IMAGES) {
      toast.error(`A room can have a maximum of ${MAX_ROOM_IMAGES} photos.`);
      return;
    }

    if (files.some((file) => !acceptedImageTypes.has(file.type))) {
      toast.error("Use JPEG, PNG, WEBP or AVIF image files.");
      return;
    }

    if (files.some((file) => file.size > MAX_FILE_SIZE)) {
      toast.error("Each photo must be 5 MB or smaller.");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    setUploading(true);

    try {
      await api.upload(`/rooms/${room._id}/images`, formData);

      await queryClient.invalidateQueries({ queryKey: ["rooms"] });

      toast.success("Room photos uploaded successfully.");
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Unable to upload room photos.",
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex min-w-40 flex-col gap-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        multiple
        className="hidden"
        aria-label={`Select photos for room ${room.roomNumber}`}
        onChange={handleUpload}
      />

      {images.length > 0 ? (
        <div className="flex items-center gap-1.5">
          {images.slice(0, 3).map((image, index) => (
            <a
              key={`${image}-${index}`}
              href={image}
              target="_blank"
              rel="noreferrer"
              title="Open room photo"
              className="block size-12 shrink-0 overflow-hidden rounded-md border bg-muted"
            >
              <img
                src={image}
                alt={`Room ${room.roomNumber} photo ${index + 1}`}
                loading="lazy"
                className="size-full object-cover"
              />
            </a>
          ))}

          {images.length > 3 && (
            <span className="flex size-12 items-center justify-center rounded-md border bg-muted text-xs">
              +{images.length - 3}
            </span>
          )}
        </div>
      ) : (
        <span className="text-xs text-muted-foreground">
          No photos uploaded
        </span>
      )}

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-fit gap-2"
        disabled={uploading || images.length >= MAX_ROOM_IMAGES}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? (
          <LoaderCircle className="size-4 animate-spin" />
        ) : images.length ? (
          <ImagePlus className="size-4" />
        ) : (
          <Upload className="size-4" />
        )}

        {uploading
          ? "Uploading..."
          : images.length
            ? "Manage photos"
            : "Upload photos"}
      </Button>

      <span className="text-xs text-muted-foreground">
        {images.length}/{MAX_ROOM_IMAGES} photos
      </span>
    </div>
  );
}

const columns: LiveColumn<Room>[] = [
  {
    header: "Room #",
    render: (room) => (
      <span className="font-medium">{room.roomNumber}</span>
    ),
  },
  {
    header: "Type",
    render: (room) => room.type,
  },
  {
    header: "Capacity",
    render: (room) => room.capacity,
  },
  {
    header: "Rate / night",
    render: (room) => formatCurrency(room.rate),
  },
  {
    header: "Amenities",
    render: (room) => room.amenities?.join(", ") || "—",
  },
  {
    header: "Images",
    render: (room) => <RoomPhotos room={room} />,
  },
  {
    header: "Status",
    render: (room) => (
      <Badge variant={statusVariant[room.status]}>
        {room.status}
      </Badge>
    ),
  },
];

function RoomsPage() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data, isLoading, isError } = roomsApi.useList({
    search,
    sort: "roomNumber",
  });

  const { data: branchesData } = branchesApi.useList({
    limit: 100,
  });

  const createRoom = roomsApi.useCreate();

  const rooms = data?.data ?? [];
  const branches = branchesData?.data ?? [];

  const stats = {
    "Total rooms": data?.total ?? "—",
    Available: rooms.filter((room) => room.status === "Available").length,
    Occupied: rooms.filter((room) => room.status === "Occupied").length,
    "Out of service": rooms.filter(
      (room) => room.status === "Maintenance",
    ).length,
  };

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formElement = event.currentTarget;
    const form = new FormData(formElement);

    const roomNumber = String(form.get("roomNumber") ?? "").trim();
    const branch = String(form.get("branch") ?? "");
    const type = String(form.get("type") ?? "Single") as RoomType;
    const capacity = Number(form.get("capacity"));
    const rate = Number(form.get("rate"));

    if (!roomNumber || !branch) {
      toast.error("Enter a room number and select a branch.");
      return;
    }

    if (!Number.isFinite(capacity) || capacity < 1) {
      toast.error("Capacity must be at least 1.");
      return;
    }

    if (!Number.isFinite(rate) || rate < 0) {
      toast.error("Enter a valid room rate.");
      return;
    }

    const payload = {
      roomNumber,
      branch,
      type,
      capacity,
      rate,
      amenities: String(form.get("amenities") ?? "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    try {
      await createRoom.mutateAsync(payload);
      toast.success("Room added successfully.");
      setDialogOpen(false);
      formElement.reset();
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Failed to add room.",
      );
    }
  }

  return (
    <>
      <ModulePage
        title="Room Management"
        description="Manage rooms, rates, amenities and photographs shown to customers."
        action="Add room"
        onAction={() => setDialogOpen(true)}
        stats={[
          "Total rooms",
          "Available",
          "Occupied",
          "Out of service",
        ]}
        statValues={stats}
        columns={columns.map((column) => column.header)}
        capabilities={[
          "Single",
          "Double",
          "Deluxe",
          "Executive",
          "Suite",
          "Room photographs",
          "Amenities",
          "Available",
          "Reserved",
          "Occupied",
          "Cleaning",
          "Maintenance",
        ]}
        table={
          <LiveDataTable
            columns={columns}
            rows={rooms}
            isLoading={isLoading}
            isError={isError}
            search={search}
            onSearchChange={setSearch}
            recordCount={data?.total}
            emptyTitle="No rooms yet"
            emptyHint="Add your first room to get started."
          />
        }
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Add room</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="roomNumber">Room number</Label>
                <Input
                  id="roomNumber"
                  name="roomNumber"
                  placeholder="e.g. 101"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="branch">Branch</Label>
                <Select name="branch" required>
                  <SelectTrigger id="branch">
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch._id} value={branch._id}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="type">Room type</Label>
                <Select name="type" defaultValue="Single" required>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {roomTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="capacity">Guest capacity</Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  min={1}
                  defaultValue={2}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="rate">Rate per night (KSh)</Label>
              <Input
                id="rate"
                name="rate"
                type="number"
                min={0}
                step="0.01"
                placeholder="e.g. 4500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="amenities">Amenities</Label>
              <Input
                id="amenities"
                name="amenities"
                placeholder="WiFi, TV, Air conditioning"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={createRoom.isPending || branches.length === 0}
              >
                {createRoom.isPending ? "Adding..." : "Add room"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
