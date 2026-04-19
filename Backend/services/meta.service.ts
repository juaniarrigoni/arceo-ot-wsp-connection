import axios from 'axios'

const META_URL = () =>
    `https://graph.facebook.com/${process.env.META_API_VERSION}/${process.env.META_PHONE_NUMBER_ID}/messages`

export const enviarTemplateWhatsapp = async (
    telefono: string,
    params: { nombre: string; otId: string; descripcion: string; observacion: string }
): Promise<boolean> => {
    try {
        const response = await axios.post(META_URL(), {
            messaging_product: 'whatsapp',
            to: telefono,
            type: 'template',
            template: {
                name: process.env.META_TEMPLATE_NAME,
                language: { code: 'es_AR' },
                components: [{
                    type: 'body',
                    parameters: [
                        { type: 'text', text: params.nombre },
                        { type: 'text', text: params.otId },
                        { type: 'text', text: params.descripcion },
                        { type: 'text', text: params.observacion }
                    ]
                }]
            }
        }, {
            headers: {
                Authorization: `Bearer ${process.env.META_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            }
        })
        console.log(`[MetaService] ✅ Mensaje enviado a ${telefono}:`, response.data)
        return true
    } catch (error: any) {
        console.error(`[MetaService] ❌ Error enviando a ${telefono}:`, error?.response?.data || error.message)
        return false
    }
}
