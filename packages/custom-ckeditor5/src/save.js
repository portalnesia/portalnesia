import Plugin from '@ckeditor/ckeditor5-core/src/plugin'
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview'
import saveIcon from './save_icon.svg';
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
        const onSaveClick = editor.config.get('save').onClick;

        editor.ui.componentFactory.add('save',(locale)=>{
            const view = new ButtonView(locale);
            
            view.set({
                label:t("Save"),
                icon: saveIcon,
                tooltip: true
            })

            view.on("execute",()=>{
                if(onSaveClick) onSaveClick();
            })

            return view;
        });
    }
}