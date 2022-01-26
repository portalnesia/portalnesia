import Plugin from '@ckeditor/ckeditor5-core/src/plugin'
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview'
import saveIcon from './icon/save_icon.svg';
import {add} from '@ckeditor/ckeditor5-utils/src/translation-service'

export default class Save extends Plugin {
    static get pluginName() {
        return "Save";
    }
    init() {
        add('en',{
            'Save': 'Save'
        })
        add('id',{
            'Save':'Simpan'
        })
        
        const editor = this.editor;
        const t = editor.locale.t;
        const onSaveClick = editor.config.get('portalnesia').onSave;

        editor.ui.componentFactory.add('save',(locale)=>{
            const view = new ButtonView(locale);
            
            view.set({
                label:t("Save"),
                icon: saveIcon,
                tooltip: true
            })

            // The button should be disabled if one of the following conditions is met:
			view.bind( 'isEnabled' ).to(
				this, 'isEnabled',
				editor, 'isReadOnly',
				( isEnabled, isEditorReadOnly ) => {
					// (1) The plugin itself is disabled.
					if ( !isEnabled ) {
						return false;
					}

					// (2) The editor is in read-only mode.
					if ( isEditorReadOnly ) {
						return false;
					}

					return true;
				}
			);

            view.on("execute",()=>{
                if(onSaveClick) onSaveClick();
            })

            return view;
        });
    }
}