export default function Values() {
    const values = [
        {
            title: "Compasión",
            description: "Tratamos a cada mascota como si fuera nuestra propia familia, con gentileza y empatía.",
            icon: "❤️",
        },
        {
            title: "Excelencia",
            description: "Nos mantenemos a la vanguardia de la medicina veterinaria para ofrecer los mejores tratamientos.",
            icon: "⭐",
        },
        {
            title: "Integridad",
            description: "Creemos en la transparencia y la honestidad en cada diagnóstico y recomendación.",
            icon: "🛡️",
        },
    ];

    return (
        <div className="bg-white py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-base text-teal-600 font-semibold tracking-wide uppercase">Nuestros Valores</h2>
                    <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                        Lo que nos define
                    </p>
                </div>
                <div className="mt-20">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {values.map((value) => (
                            <div key={value.title} className="pt-6">
                                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                                    <div className="-mt-6">
                                        <div>
                                            <span className="inline-flex items-center justify-center p-3 bg-teal-500 rounded-md shadow-lg text-4xl">
                                                {value.icon}
                                            </span>
                                        </div>
                                        <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">{value.title}</h3>
                                        <p className="mt-5 text-base text-gray-500">{value.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
