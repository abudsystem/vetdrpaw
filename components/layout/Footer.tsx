export default function Footer() {
    return (
        <footer className="bg-teal-950 text-white">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-xl font-bold text-teal-400 mb-4">VetDrPaw</h3>
                        <p className="text-gray-400 text-sm">
                            Cuidado veterinario de excelencia con un enfoque compasivo y moderno.
                            Tu mascota, nuestra prioridad.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li><a href="/" className="hover:text-teal-400 transition-colors">Inicio</a></li>
                            <li><a href="/sobre" className="hover:text-teal-400 transition-colors">Sobre Nosotros</a></li>
                            <li><a href="/contacto" className="hover:text-teal-400 transition-colors">Contacto</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contacto</h3>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li>📍 Av. Principal 123, Ciudad</li>
                            <li>📞 (555) 123-4567</li>
                            <li>📧 contacto@vetdrpaw.com</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} VetDrPaw. Todos los derechos reservados.
                </div>
            </div>
        </footer>
    );
}
