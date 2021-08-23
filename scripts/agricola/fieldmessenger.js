let all_tiles = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
let field_tiles = [1,2,3,4,5,7,8,9,10,12,13,14,15]
let room_tiles = [6,11]

function toggle(args){
    let tile = document.getElementById(args)
    tile.classList.remove('choice');
    tile.classList.toggle('selected');
}

function submit(){
    let not_selected_tiles = [];

    field_tiles.forEach((tile_id) => {
        let tile = document.getElementById(tile_id);
        if (!tile.classList.contains('selected')) {
            not_selected_tiles.push(tile.id);
        }
    });
    let choice = not_selected_tiles[Math.floor(Math.random()*not_selected_tiles.length)];
    reset();
    chosen_tile = document.getElementById(""+choice);
    chosen_tile.classList.add('choice');
}

function reset(){
    field_tiles.forEach((tile_id) => {
        let tile = document.getElementById(tile_id);
        tile.classList.remove('selected');
        tile.classList.remove('choice');
    });
}