import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ImageFullBig from './icon/fullscreen-big.svg';
import ImageFullCancel from './icon/fullscreen-cancel.svg';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import './css/style.css'

export default class Fullscreen extends Plugin {
    static get pluginName() {
        return "Fullscreen";
    }
    init() {
        const editor = this.editor;

        editor.ui.componentFactory.add( 'fullscreen', locale => {
            const view = new ButtonView( locale );
            let etat = 0; // normal mode
            let isOverflowHidden=false;
            view.set( {
                label: 'Full screen',
                icon: ImageFullBig,
                tooltip: true
            } );

            // Callback executed once the toolbar is clicked.
            view.on( 'execute', () => {
                if(etat==1){
                    const edElement = editor.sourceElement.nextElementSibling;
                    const boElement = document.body;
                    if(!isOverflowHidden) boElement.style.removeProperty('overflow');
                    edElement.classList.remove("pn_ck_fullscreen");
                    view.set( {
                        label: 'Full screen',
                        icon: ImageFullBig,
                        tooltip: true
                    } );
                    etat=0;
                }else{
                    const edElement = editor.sourceElement.nextElementSibling;
                    const boElement = document.body;
                    isOverflowHidden = boElement.style.overflow === 'hidden';
                    if(!isOverflowHidden) boElement.style.overflow = 'hidden';
                    edElement.classList.add("pn_ck_fullscreen");
                    view.set( {
                        label: 'Normal',
                        icon: ImageFullCancel,
                        tooltip: true
                    } );
                    etat=1;
                }
            
            } );

            return view;
        } );
    }
}
