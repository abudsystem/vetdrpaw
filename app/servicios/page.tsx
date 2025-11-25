export default function ServicesPage() {
    const services = [
        {
            category: "🐾 Servicios Veterinarios",
            items: [
                "👨‍⚕️ Consulta general",
                "🚨 Consulta de urgencias (24 horas)",
                "📈 Control crecimiento y peso",
                "🐶👵 Control geriátrico (mascotas mayores)",
                "🩺 Control postoperatorio",
                "💊 Seguimiento de tratamientos",
            ],
        },
        {
            category: "💉 Vacunaciones y Desparasitaciones",
            items: [
                "📅 Planes de vacunaciones",
                "🦠 Desparasitaciones internas",
                "🐜 Desparasitaciones externas",
                "🛡️ Programas preventivos",
                "🐾 Productos antiparasitarios",
            ],
        },
        {
            category: "🔪 Cirugías",
            items: [
                "✂️ Esterilizaciones / Castraciones",
                "🧵 Cirugías tejidos blandos",
                "🦴 Cirugías traumatológicas",
                "👁️ Cirugías oculares",
                "🚑 Cirugías de emergencia",
            ],
        },
        {
            category: "🏥 Hospitalización",
            items: [
                "📡 Monitoreo 24h",
                "🥣 Alimentación y control de fluidos",
            ],
        },
        {
            category: "🎀 Servicios Complementarios",
            items: [
                "🥗 Alimentos clínicos y para mascotas",
                "🛍️ Productos veterinarios",
                "✂️🐕 Cortes de pelo y baños medicados",
                "🐾 Corte de uñas y limpieza de oídos",
                "🧸 Juguetes, accesorios, camas y correas",
                "💆‍♂️ Día de Spa (Baño + Corte + Uñas)",
            ],
        },
        {
            category: "📄 Certificados y Trámites",
            items: [
                "💉 Certificados de vacunaciones",
                "🦠 Certificados de desparasitaciones",
                "🔪 Certificados de cirugías",
                "🏥 Certificados de hospitalizaciones",
                "🐶❤️ Certificados de adopción",
                "✈️ Trámites sanitarios para traslados/exportación",
            ],
        },
    ];

    return (
        <div className="bg-white py-16 sm:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-base text-teal-600 font-semibold tracking-wide uppercase">
                        Nuestros Servicios
                    </h2>
                    <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                        Cuidado Integral para tu Mascota
                    </p>
                    <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                        Servicios médicos, preventivos y complementarios para asegurar
                        la salud y bienestar de tu mejor amigo.
                    </p>
                </div>

                <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {services.map((section) => (
                        <div
                            key={section.category}
                            className="bg-gray-50 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                        >
                            <div className="px-6 py-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-4 border-b border-teal-200 pb-2">
                                    {section.category}
                                </h3>
                                <ul className="space-y-3">
                                    {section.items.map((item) => (
                                        <li key={item} className="flex items-start">
                                            <span className="flex-shrink-0 h-5 w-5 text-teal-500">
                                                •
                                            </span>
                                            <span className="ml-2 text-gray-600">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
