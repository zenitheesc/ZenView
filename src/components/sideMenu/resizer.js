const interact = require('interactjs');

module.exports = class Resizer {

    constructor() {

        this.element = document.getElementById('SideMenu');

    }
    build() {
        
        interact(this.element).resizable({
            edges: {
                top: false,
                left: false,
                bottom: false,
                right: true,
            },
            listeners: {
                move(event) {
                
                    const target = event.target;
                    const append = document.getElementById('Menus');
                    let x = (parseFloat(target.getAttribute('data-x')) || 0);
                    
                    if (append.style.display === 'block') {

                        target.style.width = event.rect.width + 'px';
                        append.style.width = (event.rect.width - Math.floor(screen.width / 32)) + 'px';
                
                        x += event.deltaRect.left;
                
                        target.style.webkitTransform = target.style.transform =
                            'translate(' + x + 'px, 0)';
                
                        target.setAttribute('data-x', x);
                    
                    }

                },
            },
            modifiers: [
                interact.modifiers.restrictSize({
                    min: {width: Math.floor(screen.width / 4)},
                    max: {width: Math.floor(screen.width / 2)},
                }),
            ],
            cursorChecker: (action, interactable, element, interacting) => {

                if (document.getElementById('Menus').style.display === 'block') {

                    return 'ew-resize';
                
                } else {

                    return 'default';
                
                }
            
            },

        });
    
    }

};