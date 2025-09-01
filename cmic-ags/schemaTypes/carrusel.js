export default {
    name: 'carrusel',
    title: 'Carrusel',
    type: 'document',
    fields: [
        {
            name: 'titulo',
            title: 'Título',
            type: 'string',
        },
        {
            name: 'descripcion',
            title: 'Descripción',
            type: 'string',
        },
        {
            name: 'images',
            title: 'Imágenes',
            type: 'array',
            of: [{ type: 'image', options: { hotspot: true } }],
        },
    ],
};
