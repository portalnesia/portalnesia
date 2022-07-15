import { ResponsePagination, ISeen,IDate } from "@api/base";
import BaseApi from "../base";
import {BasicUser} from '@src/api/user'

export const BLOG_CATEGORY = ["uncategory","tutorial","blog"];

export type BasicBlog = {
    id:number,
    title:string,
    created: IDate,
    image: string,
    slug:string,
    link:string,
    seen:ISeen,
    category: string,
    tags: string[],
    publish: boolean,
    user:BasicUser
}

export interface IBlog extends BasicBlog {
    text: string;
    format:string;
    last_modified:IDate;
    block: boolean;
    liked?: boolean;
    comment_count?: ISeen;
}

export interface BlogDashboard extends IBlog {

}

/**
 * Portalnesia Blog API
 * @class Blog
 * @extends {BaseApi}
 */
export default class Blog extends BaseApi {
    /**
     * Get all of Portalnesia Blog
     * @param page number Number of page
     * @param per_page number Total data per page
     * @returns object {@link ResponsePagination | Pagination} of {@link BasicBlog | Blog}
     */
    async getAllBlog(page=1,per_page=15): Promise<ResponsePagination<BasicBlog>> {
        return await this.request<ResponsePagination<BasicBlog>>('get',this.getFullUrl('/blog'),{page,per_page});
    }

    /**
     * Get Blog
     * @param slug string `slug` of blog
     * @returns object {@link IBlog | Blog Response}
     */
    async getBlog(slug: string): Promise<IBlog> {
        return await this.request<IBlog>('get',this.getFullUrl(`/blog/${slug}`));
    }
}

