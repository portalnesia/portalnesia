import {BasicUser} from '@api/user/type'
import { ISeen,IDate } from '@src/type';

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

export interface Blog extends BasicBlog {
    text: string;
    format:string;
    last_modified:IDate;
    block: boolean;
    liked?: boolean;
    comment_count?: ISeen;
}

export interface BlogDashboard extends Blog {

}