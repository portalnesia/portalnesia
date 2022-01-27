import Plugin from '@ckeditor/ckeditor5-core/src/plugin'
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview'
import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg'
import ImageEditing from '@ckeditor/ckeditor5-image/src/image/imageediting'
import ImageInsertPanelView from '@ckeditor/ckeditor5-image/src/imageinsert/ui/imageinsertpanelview';
import { prepareIntegrations } from '@ckeditor/ckeditor5-image/src/imageinsert/utils';
import ImageInsertUi from '@ckeditor/ckeditor5-image/src/imageinsert/imageinsertui'
import ImageCaptionEditing from '@ckeditor/ckeditor5-image/src/imagecaption/imagecaptionediting';
import ImageUtils from '@ckeditor/ckeditor5-image/src/imageutils';

export default class ImageManager extends Plugin {
    static get requires() {
        return [ ImageEditing, ImageUtils, ImageInsertUi, ImageCaptionEditing ]
    }
    static get pluginName() {
        return "ImageManager";
    }

    init() {
        const editor = this.editor;
		const t = editor.locale.t;
        const onImageManagerClick = editor.config.get('portalnesia').onImageManager;
        const command = editor.commands.get("insertImage");

        editor.ui.componentFactory.add('imageManagerBrowser',(locale)=>{
            const view = new ButtonView(locale);
            
            view.set({
                label:t("Insert image"),
                icon: imageIcon,
                tooltip: true
            })

            view.bind('isEnabled').to(command);

            view.on("execute",()=>{
                if(onImageManagerClick) onImageManagerClick();
            })

            return view;
        });

		const componentCreator = locale => {
			return this._createDropdownView( locale );
		};
		editor.ui.componentFactory.add( 'imageManager', componentCreator );
    }

    _createDropdownView(locale) {
        const editor = this.editor;
		const imageInsertView = new ImageInsertPanelView( locale, prepareIntegrations( editor ) );
		const command = editor.commands.get("insertImage");

        const dropdownView = imageInsertView.dropdownView;
		const splitButtonView = dropdownView.buttonView;

        splitButtonView.actionView = editor.ui.componentFactory.create( 'imageManagerBrowser' );
        splitButtonView.actionView.extendTemplate( {
			attributes: {
				class: 'ck ck-button ck-splitbutton__action'
			}
		} );
        return this._setUpDropdown( dropdownView, imageInsertView, command );
    }

    
	_setUpDropdown( dropdownView, imageInsertView, command ) {
        const editor = this.editor;
		const t = editor.t;
		const insertButtonView = imageInsertView.insertButtonView;
		const insertImageViaUrlForm = imageInsertView.getIntegration( 'insertImageViaUrl' );
		const panelView = dropdownView.panelView;
		const imageUtils = this.editor.plugins.get( 'ImageUtils' );
        dropdownView.bind( 'isEnabled' ).to( command );

		// Defer the children injection to improve initial performance.
		// See https://github.com/ckeditor/ckeditor5/pull/8019#discussion_r484069652.
		dropdownView.buttonView.once( 'open', () => {
			panelView.children.add( imageInsertView );
		} );

        dropdownView.on( 'change:isOpen', () => {
			const selectedElement = editor.model.document.selection.getSelectedElement();

			if ( dropdownView.isOpen ) {
				imageInsertView.focus();

				if ( imageUtils.isImage( selectedElement ) ) {
					imageInsertView.imageURLInputValue = selectedElement.getAttribute( 'src' );
					insertButtonView.label = t( 'Update' );
					insertImageViaUrlForm.label = t( 'Update image URL' );
				} else {
					imageInsertView.imageURLInputValue = '';
					insertButtonView.label = t( 'Insert' );
					insertImageViaUrlForm.label = t( 'Insert image via URL' );
				}
			}
		// Note: Use the low priority to make sure the following listener starts working after the
		// default action of the drop-down is executed (i.e. the panel showed up). Otherwise, the
		// invisible form/input cannot be focused/selected.
		}, { priority: 'low' } );

        imageInsertView.delegate( 'submit', 'cancel' ).to( dropdownView );
		this.delegate( 'cancel' ).to( dropdownView );

		dropdownView.on( 'submit', () => {
			closePanel();
			onSubmit();
		} );

		dropdownView.on( 'cancel', () => {
			closePanel();
		} );

		function onSubmit() {
			const selectedElement = editor.model.document.selection.getSelectedElement();

			if ( imageUtils.isImage( selectedElement ) ) {
				editor.model.change( writer => {
					writer.setAttribute( 'src', imageInsertView.imageURLInputValue, selectedElement );
					writer.removeAttribute( 'srcset', selectedElement );
					writer.removeAttribute( 'sizes', selectedElement );
				} );
			} else {
				editor.execute( 'insertImage', { source: imageInsertView.imageURLInputValue } );
			}
		}

		function closePanel() {
			editor.editing.view.focus();
			dropdownView.isOpen = false;
		}

		return dropdownView;
    }

    handleSelectedImage(source,caption=null){
        const editor = this.editor;
        const imageUtils = this.editor.plugins.get( 'ImageUtils' );

        const selectedElement = editor.model.document.selection.getSelectedElement();
        if ( imageUtils.isImage( selectedElement ) ) {
            editor.model.change( writer => {
                writer.setAttribute( 'src', source, selectedElement );
                writer.removeAttribute( 'srcset', selectedElement );
                writer.removeAttribute( 'sizes', selectedElement );
            } );
        } else {
            editor.execute( 'insertImage', { source } );

			if(caption) {
				editor.model.change(writer=>{
					const selection = editor.model.document.selection;
					let selectedImage = selection.getSelectedElement();

					if(imageUtils.isInlineImage(selectedImage)) {
						editor.execute('imageTypeBlock');
						selectedImage = selection.getSelectedElement();
					}

					const newCaptionElement = writer.createElement('caption');

					if(Array.isArray(caption)) {
						caption.forEach(c=>{
							insertCaption(writer,newCaptionElement,c);
						})
					} else {
						insertCaption(writer,newCaptionElement,caption);
					}
					writer.append(newCaptionElement,selectedImage);
				})
			}
        }
    }
}

function insertCaption(writer,element,caption) {
	if(typeof caption === 'string') {
		insertTextCaption(writer,element,caption);
	} else if(typeof caption === 'object' && typeof caption.text === 'string' && typeof caption.href === 'string') {
		insertLinkCaption(writer,element,caption)
	}
}

function insertTextCaption(writer,element,caption) {
	writer.appendText(caption,element);
}

function insertLinkCaption(writer,element,caption) {
	const {text,href} = caption;
	writer.appendText(text,{linkHref:href},element);
}