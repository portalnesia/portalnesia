import PortalnesiaError from "@src/exception/PortalnesiaException";
import Portalnesia from "@src/portalnesia";
import { ResponsePagination } from "@src/type";
import { BasicBlog,Blog } from "./type";


/**
 * Get all of Portalnesia Blog
 * @param client {@link Portalnesia | Portalnesia Instance}
 * @param page number Number of page
 * @param per_page number Total data per page
 * @returns object {@link ResponsePagination | Pagination} of {@link BasicBlog | Blog}
 */
export async function getAllBlog(client: Portalnesia,page=1,per_page=15): Promise<ResponsePagination<BasicBlog>> {
    if(!client) throw new PortalnesiaError("Missing Portalnesia instance");
    return await client.request<ResponsePagination<BasicBlog>>('get',client.getFullUrl('/blog'),{page,per_page});
}

/**
 * Get Blog
 * @param client {@link Portalnesia | Portalnesia Instance}
 * @param slug string `slug` of blog
 * @returns object {@link Blog | Blog Response}
 */
export async function getBlog(client: Portalnesia,slug: string): Promise<Blog> {
    if(!client) throw new PortalnesiaError("Missing Portalnesia instance");
    return await client.request<Blog>('get',client.getFullUrl(`/blog/${slug}`));
}

