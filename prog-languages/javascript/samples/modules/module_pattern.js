/**
 * Illustrates the module pattern which uses immediate functions, objects
 * and closures to simulate modules.
 */
describe("Module Pattern", function () {
    /**
     * Module pattern uses immediate functions to create module objects
     * which expose the public interface of the module. The private
     * variables and functions defined within the immediate module
     * creation function are kept alive by the closures of the public
     * interface functions.
     */
    it('illustrates the module pattern', function () {
        // The immediate function is used to create the module object.
        // The module object provides means of access to module's
        // public interface.
        const Module = (() => {
            // A private module variable. Accessible only within the
            // module
            let counter = 0;

            // A private module function. Accessible only within the
            // module
            function incrementBy(inc) {
                counter += inc;
            }

            // Return the object that represents the public interface of
            // the module. The module's internals are kept alive by the
            // closures of functions in the public interface.
            return {
                increment: () => {
                    incrementBy(1);
                },

                decrement: () => {
                    incrementBy(-1);
                },

                getCount: () => {
                    return counter;
                }
            };
        })();

        // Assert that public interface is accessible and private variables and
        // functions aren't.
        expect(Module.increment).toBeDefined();
        expect(Module.decrement).toBeDefined();
        expect(Module.getCount).toBeDefined();
        expect(Module.counter).toBeUndefined();
        expect(Module.incrementBy).toBeUndefined();

        Module.increment();
        Module.increment();
        expect(Module.getCount()).toBe(2);
        Module.decrement();
        expect(Module.getCount()).toBe(1);
    });

    /**
     * Illustrates how to extend module's public interface without modifying the
     * original module code.
     */
    it('illustrates module pattern and augmenting modules', function () {
        const Module = (() => {
            // A private module variable
            let name = "";

            // Return an object that represents module's public interface
            return {
                getName: () => {
                    return name;
                },

                setName: (newName) => {
                    name = newName;
                }
            };
        })();

        // We extend the module by passing it to an immediate function, which
        // will create additional private module variables and functions as
        // well as extend the public interface of the module by adding properties
        // to the module object.
        //
        // This shows one the issues with the module pattern. We can't access the
        // private interface of the module when extending it, because the module
        // is extended by invoking another immediate function which creates a
        // new scope different than the scope that original module object was
        // created in. Hence there's no way to access the existing private variables
        // and functions of the module.
        //
        // Another issue with the module pattern (not illustrated here) is that it
        // provides no means of creating dependencies between modules. In large
        // projects with many modules, manual dependency handling can be painful
        // and error prone. When using module pattern the dependency management
        // must be done manually.
        ((ModuleObj) => {
            // Assert that we can't access the existing private interface of the
            // module
            expect(ModuleObj.name).toBeUndefined();

            // A new private module variable
            let surname ="";

            // Extend the module's public interface
            ModuleObj.getSurname = () => {
                return surname;
            };

            ModuleObj.setSurname = (newSurname) => {
                surname = newSurname;
            };
        })(Module);

        Module.setName("Mickey");
        Module.setSurname("Mouse");
        expect(Module.getName()).toEqual("Mickey");
        expect(Module.getSurname()).toEqual("Mouse");
    });
});