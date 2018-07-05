import PubSub from 'pubsub-js';

export default class ManageError {

    publishError(objErrors) {

        for(var i = 0; i < objErrors.errors.length; i++)
            var error = objErrors.errors[i];
            PubSub.publish('valid-error', error);
    }
}