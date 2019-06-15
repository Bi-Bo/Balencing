import { Toaster } from '@blueprintjs/core';

export default function doAlert(message) {
    let toaster = Toaster.create();
    
    toaster.show({
        message: message
    });
}