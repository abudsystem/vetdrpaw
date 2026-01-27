"use client";

import React from 'react';
import { useTranslations } from 'next-intl';

interface AppointmentData {
    _id: string;
    date: string;
    reason: string;
    pet: {
        nombre: string;
        especie?: string;
        propietario: {
            name: string;
            telefono?: string;
        };
    };
}

interface WhatsAppButtonProps {
    appointment: AppointmentData;
    className?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
    appointment,
    className = ""
}) => {
    const t = useTranslations("Components");
    const phoneNumber = appointment.pet?.propietario?.telefono;
    const hasPhoneNumber = !!phoneNumber;

    if (!hasPhoneNumber) {
        return (
            <div className={`text-xs text-gray-600 ${className}`} title={t("whatsapp.noPhoneDescription")}>
                {t("whatsapp.noPhone")}
            </div>
        );
    }

    // Format phone number
    let formattedNumber = phoneNumber.replace(/[^0-9]/g, ''); // Remove all non-numeric

    // If starts with 0, replace with country code (593 for Ecuador)
    if (formattedNumber.startsWith('0')) {
        formattedNumber = '593' + formattedNumber.substring(1);
    }
    // If doesn't start with country code, add it
    else if (!formattedNumber.startsWith('593')) {
        formattedNumber = '593' + formattedNumber;
    }

    // Generate message - keep it simple
    const clientName = appointment.pet?.propietario?.name || t("whatsapp.dearClient");
    const petName = appointment.pet?.nombre || t("whatsapp.yourPet");
    const petSpecies = appointment.pet?.especie || '';

    const appointmentDate = new Date(appointment.date).toLocaleDateString('es-ES');
    const appointmentTime = new Date(appointment.date).toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
    });

    // Simplified but friendly message
    const message = `Hola, ${clientName} 👋\nTe recordamos con gusto tu próxima cita con nosotros:\n\n📅 Para el día ${appointmentDate}\n⏰ A esta hora ${appointmentTime}\n💉 con el motivo de: ${appointment.reason}\n Con tu mascota ${petName} \n\n¡Te esperamos para cuidar la salud de tu peludito! Si necesitas reprogramar o tienes alguna consulta, no dudes en contactarnos 💙 \n\n Con gusto te esperamos en la veterinaria ubicada en: \nhttps://maps.app.goo.gl/Zkupxkj23bzto3du5
    `;


    {/* WhatsApp Móvil */ }
    return (
        <div className={`flex gap-1 ${className}`}>

            <a
                href={`https://wa.me/${formattedNumber}?text=${encodeURIComponent(message)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-center py-1 px-2 rounded-md bg-green-600 text-white text-xs font-medium hover:bg-green-700 flex items-center gap-1"
            >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                <span className="hidden sm:inline">{t('whatsapp.phone')}</span>
            </a>

            {/* WhatsApp Web */}
            <a
                href={`https://web.whatsapp.com/send?phone=${formattedNumber}&text=${encodeURIComponent(message)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-center py-1 px-2 rounded-md bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 flex items-center gap-1"
            >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                <span className="hidden sm:inline">{t('whatsapp.web')}</span>
            </a>
        </div >
    );
};

export default WhatsAppButton;
