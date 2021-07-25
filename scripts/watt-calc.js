function calculate(watts) {
    if (isNaN(watts) || watts==0){
        let runtime_element = document.getElementById('runtime');
        runtime_element.innerHTML = "? hours";
    } else {
        let rate = 0.1;
        let cost = 1;
        
        //watts = 5
        //cost = 10
        let runtime_unit = "hours";
        let runtime = (1000/watts) * (cost/rate);
    
        if (runtime > 100) {
            runtime = runtime/24;
            runtime_unit = "days";
        }
        let runtime_output = (runtime == Math.round(runtime) ? runtime : runtime.toFixed(2)) + " " + runtime_unit;
    
        let runtime_element = document.getElementById('runtime');
        runtime_element.innerHTML = runtime_output;
    }
}