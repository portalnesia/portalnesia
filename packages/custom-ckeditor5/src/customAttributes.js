

export default class CustomAttributes {
    constructor( editor ) {
        // Save reference to the editor.
        this.editor = editor;
    }
    afterInit() {
        const editor = this.editor;
        setupCustomImage('imageInline',editor);
        setupCustomImage('imageBlock',editor);
        setupCustomHeading('heading1',editor)
        setupCustomHeading('heading2',editor)
        setupCustomHeading('heading3',editor)
    }

}

/**
 * Sets up a conversion for a custom attribute on the view elements contained inside a <figure>.
 *
 * This method:
 * - Adds proper schema rules.
 * - Adds an upcast converter.
 * - Adds a downcast converter.
 */
 function setupCustomImage(element,editor) {
    // Extends the schema to store an attribute in the model.
    const viewAttribute = "data-png";
    const modelAttribute = `customDataPng`;

    editor.model.schema.extend( element, { allowAttributes: modelAttribute } );

    editor.conversion.for( 'upcast' ).attributeToAttribute( {
        view: viewAttribute,
        model: modelAttribute
    }, { priority: 'low' } );

    editor.conversion.for( 'downcast' ).add( dispatcher => {
        dispatcher.on( 'attribute:customDataPng:'+element, ( evt, data, conversionApi ) => {
            if ( !conversionApi.consumable.consume( data.item, evt.name ) ) {
                return;
            }
    
            const viewWriter = conversionApi.writer;
            const figure = conversionApi.mapper.toViewElement( data.item );
            const img = figure.getChild( 0 );
    
            if ( data.attributeNewValue !== null ) {
                viewWriter.setAttribute( 'data-png', data.attributeNewValue, img );
            } else {
                viewWriter.removeAttribute( 'data-png', img );
            }
        } );
    }, { priority: 'low' } );
}

function setupCustomHeading(element,editor) {
    const viewAttribute = "id";
    const modelAttribute = `customDataId`;

    editor.model.schema.extend( element, { allowAttributes: modelAttribute } );

    editor.conversion.for( 'upcast' ).attributeToAttribute( {
        view: viewAttribute,
        model: modelAttribute
    }, { priority: 'low' } );

    editor.conversion.for( 'downcast' ).add( dispatcher => {
        dispatcher.on( 'attribute:customDataId:'+element, ( evt, data, conversionApi ) => {
            if ( !conversionApi.consumable.consume( data.item, evt.name ) ) {
                return;
            }
    
            const viewWriter = conversionApi.writer;
            const heading = conversionApi.mapper.toViewElement( data.item );
    
            if ( data.attributeNewValue !== null ) {
                viewWriter.setAttribute( 'id', data.attributeNewValue, heading );
            } else {
                viewWriter.removeAttribute( 'id', heading );
            }
        } );
    }, { priority: 'low' } );
}