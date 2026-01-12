import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import GalleryImage from "@/models/GalleryImage";

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        console.log("Attempting to delete image with ID:", id);
        await dbConnect();
        const deletedImage = await GalleryImage.findByIdAndDelete(id);
        console.log("Delete result:", deletedImage);

        if (!deletedImage) {
            return NextResponse.json(
                { error: "Imagen no encontrada" },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: "Imagen eliminada correctamente" });
    } catch (error) {
        console.error("Error deleting gallery image:", error);
        return NextResponse.json(
            { error: "Error al eliminar la imagen" },
            { status: 500 }
        );
    }
}
