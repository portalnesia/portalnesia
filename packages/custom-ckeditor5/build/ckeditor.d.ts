import {FunctionComponent} from 'react'
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor.js';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin'
import { EditorConfig } from '@ckeditor/ckeditor5-core/src/editor/editorconfig';
import EventInfo from '@ckeditor/ckeditor5-utils/src/eventinfo';

declare module '@ckeditor/ckeditor5-core/src/editor/editorconfig' {
    export interface EditorConfig {
        /**
         * Portalnesia configuration
         */
        portalnesia?:{
            /**
             * Callback when save toolbar is clicked.
             */
            onSave?(): void;
            /**
             * Callback when imageManager toolbar is clicked.
             */
            onImageManager?(): void
        }
    }
}

type CaptionLinkTypes = {text: string,href: string}
/**
 * Insert caption to images.
 * @argument string; for string caption
 * @argument \{ text: string,href: string };  for link caption
 * @argument Array of string or link object;
 */
type CaptionTypes = string|CaptionLinkTypes|Array<string|CaptionLinkTypes>

export class ImageManager extends Plugin {
    handleSelectedImage(src: string,caption?:CaptionTypes): void;
}

export type CKEditorReactProps = {
    editor: typeof ClassicEditor
    disabled?: boolean;
    data?: string
    id?: string
    config?: EditorConfig;
    onReady?(editor: ClassicEditor): void
    onChange?(event: EventInfo,editor: ClassicEditor): void;
    onBlur?(event: EventInfo,editor: ClassicEditor): void;
    onFocus?(event: EventInfo,editor: ClassicEditor): void;
    onError?(event: EventInfo,editor: ClassicEditor): void;
}

export default class PortalnesiaEditor extends ClassicEditor {}