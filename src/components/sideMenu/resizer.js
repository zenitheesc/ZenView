const interact = require('interactjs')

module.exports = class Resizer {

    constructor(){

        this.element = document.getElementById('SideMenu');

    }
    build(){

        interact(this.element).resizable({
            edges: {
                top: false,
                left: true,
                bottom: false,
                right: true,
            },
            listeners: {
                move (event) {
                
                    let target = event.target;
                    let append = document.getElementById('Menus');
                    let x = (parseFloat(target.getAttribute('data-x')) || 0);
          
                    target.style.width = event.rect.width + 'px';
                    append.style.width = (event.rect.width - Math.floor(screen.width / 32)) + 'px';
            
                    x += event.deltaRect.left
            
                    target.style.webkitTransform = target.style.transform =
                        'translate(' + x + 'px, 0)';
            
                    target.setAttribute('data-x', x);

                }
            },
            modifiers: [
                interact.modifiers.restrictSize({
                    min: {width: Math.floor(screen.width / 4)},
                    max: {width:Math.floor(screen.width / 2)},
                }),
            ],
        });

    }
}