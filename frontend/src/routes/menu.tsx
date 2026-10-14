import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { format } from "date-fns";
import {
  ImagePlus,
  LoaderCircle,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

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

import { api, ApiError } from "@/lib/api";
import { menuItemsApi } from "@/lib/resources";
import type { MenuItem } from "@/lib/types";
import { formatCurrency } from "../lib/currency";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu Management — Aurelia Suites" },
      {
        name: "description",
        content:
          "Manage restaurant dishes, food photographs, categories, prices and availability.",
      },
    ],
  }),
  component: MenuPage,
});

type MenuItemWithImage = MenuItem & {
  image?: string;
};

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}

function FoodPhoto({ item }: { item: MenuItem }) {
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const image = (item as MenuItemWithImage).image;

  async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    input.value = "";

    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      toast.error("Choose a JPEG, PNG, WEBP or AVIF image.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("The food photo must be 5 MB or smaller.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);

    try {
      await api.upload(`/menu-items/${item._id}/image`, formData);

      await queryClient.invalidateQueries({
        queryKey: ["menu-items"],
      });

      setImageFailed(false);
      toast.success(`Photo updated for ${item.name}.`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex min-w-36 flex-col items-start gap-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        aria-label={`Choose a photo for ${item.name}`}
        onChange={handleUpload}
      />

      {image && !imageFailed ? (
        <a
          href={image}
          target="_blank"
          rel="noreferrer"
          title={`View ${item.name} photo`}
          className="block size-20 overflow-hidden rounded-lg border bg-muted"
        >
          <img
            src={image}
            alt={item.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="size-full object-cover"
            onError={() => setImageFailed(true)}
          />
        </a>
      ) : (
        <div className="flex size-20 flex-col items-center justify-center gap-1 rounded-lg border border-dashed bg-muted text-muted-foreground">
          <ImagePlus className="size-6" />
          <span className="px-1 text-center text-[10px]">
            {image ? "Image unavailable" : "No photo"}
          </span>
        </div>
      )}

      <Button
        type="button"
        size="sm"
        variant="outline"
        className="gap-1.5"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? (
          <LoaderCircle className="size-4 animate-spin" />
        ) : image ? (
          <ImagePlus className="size-4" />
        ) : (
          <Upload className="size-4" />
        )}

        {uploading
          ? "Uploading..."
          : image
            ? "Change photo"
            : "Upload photo"}
      </Button>
    </div>
  );
}

const columns: LiveColumn<MenuItem>[] = [
  {
    header: "Photo",
    render: (item) => <FoodPhoto item={item} />,
  },
  {
    header: "Item",
    render: (item) => (
      <div className="min-w-32">
        <p className="font-medium">{item.name}</p>
        {item.description && (
          <p className="max-w-56 text-xs text-muted-foreground">
            {item.description}
          </p>
        )}
      </div>
    ),
  },
  {
    header: "Category",
    render: (item) => item.category,
  },
  {
    header: "Price",
    render: (item) => formatCurrency(item.price),
  },
  {
    header: "Availability",
    render: (item) => (
      <Badge variant={item.availability ? "default" : "destructive"}>
        {item.availability ? "Available" : "Unavailable"}
      </Badge>
    ),
  },
  {
    header: "Updated",
    render: (item) =>
      item.updatedAt
        ? format(new Date(item.updatedAt), "MMM d, yyyy")
        : "—",
  },
];

function MenuPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    data,
    isLoading,
    isError,
  } = menuItemsApi.useList({
    search,
    sort: "category",
  });

  const createItem = menuItemsApi.useCreate();
  const items = data?.data ?? [];

  const stats = {
    "Menu items": data?.total ?? "—",
    Categories: new Set(items.map((item) => item.category)).size,
    Available: items.filter((item) => item.availability).length,
    Unavailable: items.filter((item) => !item.availability).length,
  };

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formElement = event.currentTarget;
    const form = new FormData(formElement);

    const name = String(form.get("name") ?? "").trim();
    const category = String(form.get("category") ?? "").trim();
    const price = Number(form.get("price"));
    const description = String(form.get("description") ?? "").trim();

    if (!name || !category) {
      toast.error("Enter the dish name and category.");
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      toast.error("Enter a valid price.");
      return;
    }

    try {
      await createItem.mutateAsync({
        name,
        category,
        price,
        description,
      });

      await queryClient.invalidateQueries({
        queryKey: ["menu-items"],
      });

      toast.success("Menu item added successfully.");
      setDialogOpen(false);
      formElement.reset();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  return (
    <>
      <ModulePage
        title="Menu Management"
        description="Manage dishes and drinks, view seeded food photos, and upload your own photographs."
        action="Add menu item"
        onAction={() => setDialogOpen(true)}
        stats={[
          "Menu items",
          "Categories",
          "Available",
          "Unavailable",
        ]}
        statValues={stats}
        columns={columns.map((column) => column.header)}
        capabilities={[
          "Food photographs",
          "Categories",
          "Prices",
          "Descriptions",
          "Availability",
        ]}
        table={
          <LiveDataTable
            columns={columns}
            rows={items}
            isLoading={isLoading}
            isError={isError}
            search={search}
            onSearchChange={setSearch}
            recordCount={data?.total}
            emptyTitle="No menu items yet"
            emptyHint="Add your first dish or drink to get started."
          />
        }
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add menu item</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="menu-name">Dish or drink name</Label>
              <Input
                id="menu-name"
                name="name"
                placeholder="e.g. Grilled Chicken"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="menu-category">Category</Label>
                <Input
                  id="menu-category"
                  name="category"
                  placeholder="Main Course"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="menu-price">Price (KSh)</Label>
                <Input
                  id="menu-price"
                  name="price"
                  type="number"
                  min={0}
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="menu-description">Description</Label>
              <Input
                id="menu-description"
                name="description"
                placeholder="Ingredients or a short description"
              />
            </div>

            <p className="text-xs text-muted-foreground">
              Add the menu item first, then upload its photo from the Photo column.
            </p>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createItem.isPending}>
                {createItem.isPending ? "Adding..." : "Add item"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
