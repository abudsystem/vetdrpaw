export default function Footer() {
    return (
        <footer className="bg-teal-950 text-white print:hidden">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-xl font-bold text-teal-400 mb-4">Veterinaria DrPaw</h3>
                        <p className="text-gray-600 text-sm">
                            Cuidado veterinario de excelencia con un enfoque compasivo y moderno.
                            Tu mascota, nuestra prioridad.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
                        <ul className="space-y-2 text-gray-600 text-sm">
                            <li><a href="/" className="hover:text-teal-400 transition-colors">Inicio</a></li>
                            <li><a href="/sobre" className="hover:text-teal-400 transition-colors">Sobre Nosotros</a></li>
                            <li><a href="/cuidado-mascota" className="hover:text-teal-400 transition-colors">Cuidados</a></li>
                            <li><a href="/contacto" className="hover:text-teal-400 transition-colors">Contacto</a></li>
                            <li><a href="/servicios" className="hover:text-teal-400 transition-colors">Servicios</a></li>
                            <li><a href="/login" className="hover:text-teal-400 transition-colors">Login</a></li>
                            <li><a href="/register" className="hover:text-teal-400 transition-colors">Register</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contacto</h3>
                        <ul className="space-y-2 text-gray-600 text-sm">
                            <li>📍 Calle Cacha y Fundadores, Quito</li>
                            <li>📞 (+593) 099 539 8645</li>
                            <li>Horarios de Atención: Lunes a Sábado de 9:00 a 18:30</li>
                            <li>Horarios de Urgencia/Emergencia: 24 Horas</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-700 text-sm">
                    &copy; {new Date().getFullYear()} Veterinaria DrPaw. Todos los derechos reservados.
                </div>
            </div>
        </footer>
    );
}
