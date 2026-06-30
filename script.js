/* ===== Global ===== */

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    background: #181818;
    color: #f2f2f2;
    font-family: Arial, Helvetica, sans-serif;
    padding: 30px;
}

/* ===== Header ===== */

header {
    text-align: center;
    margin-bottom: 35px;
}

header h1 {
    font-size: 42px;
    margin-bottom: 8px;
    color: #ffffff;
}

header p {
    color: #999;
    font-size: 18px;
}

/* ===== Layout ===== */

#app {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
    gap: 25px;
}

/* ===== Channel Panel ===== */

.panel {
    background: #252525;
    border-radius: 12px;
    padding: 22px;
    box-shadow: 0 0 18px rgba(0,0,0,.35);
}

.panel h2 {
    text-align: center;
    margin-bottom: 20px;
    letter-spacing: 1px;
}

/* ===== Slider Rows ===== */

.slider-row {
    margin-bottom: 18px;
}

.slider-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.slider-header label {
    font-size: 15px;
    font-weight: bold;
}

.value {
    color: #66d9ff;
    font-family: monospace;
    min-width: 60px;
    text-align: right;
}

/* ===== Slider ===== */

input[type=range] {
    width: 100%;
    appearance: none;
    -webkit-appearance: none;
    background: transparent;
}

/* Chrome */

input[type=range]::-webkit-slider-runnable-track {
    height: 8px;
    background: #444;
    border-radius: 4px;
}

input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    margin-top: -6px;
    border-radius: 50%;
    background: #00c8ff;
    cursor: pointer;
    transition: .15s;
}

input[type=range]::-webkit-slider-thumb:hover {
    transform: scale(1.15);
}

/* Firefox */

input[type=range]::-moz-range-track {
    height: 8px;
    background: #444;
    border-radius: 4px;
}

input[type=range]::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border: none;
    border-radius: 50%;
    background: #00c8ff;
    cursor: pointer;
}

/* ===== Responsive ===== */

@media (max-width: 700px) {

    body {
        padding: 18px;
    }

    header h1 {
        font-size: 32px;
    }

    #app {
        grid-template-columns: 1fr;
    }

}
