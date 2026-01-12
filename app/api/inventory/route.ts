import { InventoryController } from "@/controllers/inventory.controller";

export const GET = InventoryController.list;
export const POST = InventoryController.create;
export const PUT = InventoryController.update;
export const DELETE = InventoryController.delete;
