export default function PetCarePage() {
    const articles = [
        {
            title: "La importancia de la vacunación anual",
            excerpt:
                "Las vacunas protegen contra enfermedades mortales como moquillo, parvovirus y leptospirosis. Mantener el calendario al día reduce riesgos epidemiológicos.",
            date: "23 Nov 2023",
            category: "Salud Preventiva",
            link: "https://www.avma.org/resources/pet-owners/petcare/vaccinations",
        },
        {
            title: "Nutrición adecuada para cachorros según estudios veterinarios",
            excerpt:
                "Los cachorros requieren dietas ricas en proteínas y minerales para el desarrollo óseo. Un déficit temprano puede causar displasias y problemas musculares.",
            date: "15 Nov 2023",
            category: "Nutrición",
            link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6566793/",
        },
        {
            title: "Señales científicas del estrés en gatos",
            excerpt:
                "El estrés crónico en gatos puede causar enfermedades urinarias y problemas de comportamiento. Aprende a identificar signos clínicos validados.",
            date: "02 Nov 2023",
            category: "Comportamiento",
            link: "https://journals.sagepub.com/doi/10.1177/1098612X15571880",
        },
        {
            title: "Cuidado dental en perros mayores basado en evidencia",
            excerpt:
                "La enfermedad periodontal afecta al 80% de los perros mayores. La limpieza y prevención reducen infecciones y problemas cardíacos asociados.",
            date: "28 Oct 2023",
            category: "Geriatría",
            link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7099669/",
        },
    ];

    return (
        <div className="bg-gray-50 min-h-screen py-16 sm:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Cuidado de tu Mascota
                    </h2>
                    <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                        Consejos, guías y artículos basados en estudios reales y evidencia científica.
                    </p>
                </div>

                <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-2">
                    {articles.map((article) => (
                        <div
                            key={article.title}
                            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="px-3 py-1 bg-teal-100 text-teal-800 text-xs font-semibold rounded-full">
                                        {article.category}
                                    </span>
                                    <span className="text-gray-400 text-sm">{article.date}</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {article.title}
                                </h3>
                                <p className="text-gray-600 mb-4">{article.excerpt}</p>

                                <a
                                    href={article.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-teal-600 font-medium hover:text-teal-800 transition-colors"
                                >
                                    Leer más →
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
