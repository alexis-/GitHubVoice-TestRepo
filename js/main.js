// Constants
const DEFAULT_ROTATION = -Math.PI / 2;
const MAP_EXTENT = [1194558.803012, 8618317.604343, 1195540.931820, 8619363.209844];

// Calculate extended bounds (50% outside original extent)
const EXTENT_WIDTH = MAP_EXTENT[2] - MAP_EXTENT[0];
const EXTENT_HEIGHT = MAP_EXTENT[3] - MAP_EXTENT[1];
const EXTENDED_EXTENT = [
    MAP_EXTENT[0] - EXTENT_WIDTH * 0.5,  // min X
    MAP_EXTENT[1] - EXTENT_HEIGHT * 0.5, // min Y
    MAP_EXTENT[2] + EXTENT_WIDTH * 0.5,  // max X
    MAP_EXTENT[3] + EXTENT_HEIGHT * 0.5  // max Y
];

const MAP_CENTER = [1195049.867416, 8618840.407093];

// State
let isDefaultRotation = true;

// Initialize map layers
const baseLayers = new ol.layer.Group({
    title: null,
    layers: [
        new ol.layer.Tile({
            title: null,
            type: 'base',
            extent: MAP_EXTENT,
            source: new ol.source.XYZ({
                minZoom: 14,
                maxZoom: 22,
                url: './base/{z}/{x}/{-y}.png',
                tileSize: [256, 256]
            })
        })
    ]
});

const overlayLayers = new ol.layer.Group({
    title: 'Overlay',
    layers: [
        new ol.layer.Tile({
            title: 'Skispor',
            opacity: 0.35,
            extent: MAP_EXTENT,
            source: new ol.source.XYZ({
                minZoom: 14,
                maxZoom: 22,
                url: './overlay_ski_tracks/{z}/{x}/{-y}.png',
                tileSize: [256, 256]
            })
        }),
        new ol.layer.Tile({
            title: 'Skihopp',
            opacity: 0.3,
            extent: MAP_EXTENT,
            source: new ol.source.XYZ({
                minZoom: 14,
                maxZoom: 22,
                url: './overlay_ski_jump/{z}/{x}/{-y}.png',
                tileSize: [256, 256]
            })
        }),
        new ol.layer.Tile({
            title: 'Parkering',
            opacity: 0.25,
            extent: MAP_EXTENT,
            source: new ol.source.XYZ({
                minZoom: 14,
                maxZoom: 22,
                url: './overlay_parking/{z}/{x}/{-y}.png',
                tileSize: [256, 256]
            })
        })
    ]
});

// Initialize map
const map = new ol.Map({
    controls: ol.control.defaults.defaults().extend([
        new ol.control.Rotate({
            autoHide: false,
            label: '⟲',
            tipLabel: 'Tilbakestill rotasjon',
            resetNorth: function() {
                const view = map.getView();
                const targetRotation = isDefaultRotation ? 0 : DEFAULT_ROTATION;
                view.animate({
                    rotation: targetRotation,
                    duration: 250
                });
                isDefaultRotation = !isDefaultRotation;
            }
        })
    ]),
    target: 'map',
    layers: [baseLayers, overlayLayers],
    view: new ol.View({
        center: MAP_CENTER,
        rotation: DEFAULT_ROTATION,
        zoom: 18,
        minZoom: 18,
        maxZoom: 23,
        extent: EXTENDED_EXTENT
    })
});

// Add layer switcher control
map.addControl(new ol.control.LayerSwitcher({
    activationMode: 'click',
    startActive: true,
    groupSelectStyle: 'none'  // Prevents group selection
}));

// Update compass rotation
function updateCompass() {
    const rotation = map.getView().getRotation();
    document.querySelector('.compass-arrow').style.transform = 
        `translate(-50%, -50%) rotate(${rotation * (180 / Math.PI)}deg)`;
}

// Initialize compass
map.getView().on('change:rotation', updateCompass);
updateCompass();