export default {
    name: 'servicio',
    title: 'Servicios',
    type: 'document',
    fields: [
        {
            name: 'titulo',  // Cambiado de 'nombre' a 'titulo'
            title: 'Título del Servicio',
            type: 'string'
        },
        {
            name: 'descripcion',  // Mantenido
            title: 'Descripción',
            type: 'text'
        },
        {
            name: 'imagen',  // NUEVO campo que necesitas
            title: 'Imagen del Servicio',
            type: 'image',
            options: {
                hotspot: true
            }
        },
        {
            name: 'precio',  // Opcional - puedes mantenerlo o quitarlo
            title: 'Precio',
            type: 'number',
            hidden: true  // Si no lo vas a usar en el frontend
        }
    ]
}