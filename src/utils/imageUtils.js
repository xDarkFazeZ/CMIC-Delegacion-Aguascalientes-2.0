import imageUrlBuilder from '@sanity/image-url';
import { client } from '../sanity/sanityClient';

const builder = imageUrlBuilder(client);

export const urlFor = (source) => {
    if (!source) return '';
    return builder.image(source);
};