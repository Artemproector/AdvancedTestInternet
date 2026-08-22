//светлая тема, изменение полоски шкалы и цвета
let currentdsgn = 'dsgn1'
let displays = document.querySelector('.styles_wrapper');
const DSGN1_html = `<div class="results">
                    <div class="internet-bar">
                        <div id="it-bar-1" class="it-bar-section it-bar-1">Сеть: Не определена</div>
                        <div id="it-bar-2" class="it-bar-section it-bar-2">Конфиг</div>
                    </div>
                    <div class="displays">
                        <div class="result-card dwn-card">
                            <div class="display">
                                <div class="d-elem n-5 dwn"></div>
                                <div class="d-elem n-4 dwn"></div>
                                <div class="d-elem n-3 dwn"></div>
                                <div class="d-elem n-2 dwn"></div>
                                <div class="d-elem n-1 dwn"></div>
                            </div>
                            <div class="value" id="downloadSpeed">-- <span class="unit">Мбит/с</span></div>
                            <div class="alert-block"
                                onclick="alert('Данная функция в разработке! Результат может быть не точным!')">
                                <p>Входящая</p>
                            </div>
                        </div>
                        <div class="result-card ping-card">
                            <div class="display">
                                <div class="d-elem n-5 ping"></div>
                                <div class="d-elem n-4 ping"></div>
                                <div class="d-elem n-3 ping"></div>
                                <div class="d-elem n-2 ping"></div>
                                <div class="d-elem n-1 ping"></div>
                            </div>
                            <div class="value" id="ping">-- <span class="unit">мс</span></div>
                            <p>Пинг</p>
                        </div>
                        <div class="result-card mode-card">
                            <div class="display">
                                <div class="d-elem n-5-dis mode"></div>
                                <div class="d-elem n-4 mode"></div>
                                <div class="d-elem n-3 mode"></div>
                                <div class="d-elem n-2 mode"></div>
                                <div class="d-elem n-1 mode"></div>
                            </div>
                            <div class="value" id="networkMode" style="font-size: 18px;">--</div>
                            <p>Режим сети</p>
                        </div>
                        <div class="result-card proto-card">
                            <ul class="proto-list">
                                <li>
                                    <div class="n2 proto-test">DNS</div>
                                </li>
                                <li>
                                    <div class="n3 proto-test">HTTP</div>
                                </li>
                                <li>
                                    <div class="n4 proto-test">HTTPS</div>
                                </li>
                            </ul>
                            <div class="value" id="proto">-- <span class="proto-static-test">доступно</span>
                            </div>
                            <p>Протоколы</p>
                        </div>
                        <div class="result-card" style="display: none;">
                            <div class="display">
                                <div class="d-elem n-5 up"></div>
                                <div class="d-elem n-4 up"></div>
                                <div class="d-elem n-3 up"></div>
                                <div class="d-elem n-2 up"></div>
                                <div class="d-elem n-1 up"></div>
                            </div>
                            <div class="value" id="uploadSpeed">-- <span class="unit">Мбит/с</span></div>
                            <div class="alert-block"
                                onclick="alert('Данная функция в разработке! Результат может быть не точным!')">
                                <p>Исходящая</p>
                                <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960"
                                    width="40px" fill="#BB271A">
                                    <path
                                        d="m379.33-339.33 355-355q10-10 23.67-10 13.67 0 23.67 10 10 10 10 23.83 0 13.83-10 23.83l-379 379.34q-10 10-23.34 10-13.33 0-23.33-10L177.33-446q-10-10-9.5-23.83.5-13.84 10.5-23.84t23.84-10q13.83 0 23.83 10l153.33 154.34ZM584.83-97Q528-153.33 528-233.33q0-80.34 56.83-137.17 56.84-56.83 136.5-56.83 79.67 0 136.5 56.83 56.84 56.83 56.84 137.17 0 80-56.84 136.33Q801-40.67 721.33-40.67q-79.66 0-136.5-56.33Zm136.5-21q8.67 0 15-6 6.34-6 6.34-15.33 0-9.34-6.34-15.34-6.33-6-15-6-9.33 0-15.33 6t-6 15.34q0 9.33 6 15.33t15.33 6Zm0-83.33q8 0 13-5.34 5-5.33 5-13.33v-112q0-8-5.33-13t-13.33-5q-8 0-13 5.33-5 5.34-5 13.34v112q0 8 5.33 13t13.33 5Z" />
                                </svg>
                            </div>
                        </div>
                    </div>`
const DSGN2_html = `                    <div class="results">
                        <div class="internet-bar">
                            <div id="it-bar-1" class="it-bar-section it-bar-1">Сеть: Не определена</div>
                            <div id="it-bar-2" class="it-bar-section it-bar-2">Конфиг</div>
                        </div>
                        <div class="displays--DSGN2">
                            <div class="result-card--DSGN2 dwn-card--DSGN2">
                                <div class="result__wrapper--DSGN2">
                                    <div class="value" id="downloadSpeed">-- <span class="unit">Мбит/с</span></div>
                                    <p>Входящая</p>
                                </div>
                                <div class="display--DSGN2">
                                    <div class="d-elem n-5 dwn"></div>
                                    <div class="d-elem n-4 dwn"></div>
                                    <div class="d-elem n-3 dwn"></div>
                                    <div class="d-elem n-2 dwn"></div>
                                    <div class="d-elem n-1 dwn"></div>
                                </div>
                            </div>
                            <div class="result-card--DSGN2 ping-card--DSGN2">
                                <div class="result__wrapper--DSGN2">
                                    <div class="value" id="ping">-- <span class="unit">мс</span></div>
                                    <p>Пинг</p>
                                </div>
                                <div class="display--DSGN2">
                                    <div class="d-elem n-5 ping"></div>
                                    <div class="d-elem n-4 ping"></div>
                                    <div class="d-elem n-3 ping"></div>
                                    <div class="d-elem n-2 ping"></div>
                                    <div class="d-elem n-1 ping"></div>
                                </div>

                            </div>
                            <div class="result-card--DSGN2 mode-card--DSGN2">
                                <div class="result__wrapper--DSGN2">
                                    <div class="value" id="networkMode" style="font-size: 18px;">--</div>
                                    <p>Режим сети</p>
                                </div>
                                <div class="display--DSGN2">
                                    <div class="d-elem n-5-dis mode"></div>
                                    <div class="d-elem n-4 mode"></div>
                                    <div class="d-elem n-3 mode"></div>
                                    <div class="d-elem n-2 mode"></div>
                                    <div class="d-elem n-1 mode"></div>
                                </div>

                            </div>
                            <div class="result-card proto-card--DSGN2">
                                <ul class="proto-list">
                                    <li>
                                        <div class="n2 proto-test">DNS</div>
                                    </li>
                                    <li>
                                        <div class="n3 proto-test">HTTP</div>
                                    </li>
                                    <li>
                                        <div class="n4 proto-test">HTTPS</div>
                                    </li>
                                </ul>
                                <div class="value" id="proto">-- <span class="proto-static-test">доступно</span>
                                </div>
                                <p>Протоколы</p>
                            </div>
                            <div class="result-card" style="display: none;">
                                <div class="display">
                                    <div class="d-elem n-5 up"></div>
                                    <div class="d-elem n-4 up"></div>
                                    <div class="d-elem n-3 up"></div>
                                    <div class="d-elem n-2 up"></div>
                                    <div class="d-elem n-1 up"></div>
                                </div>
                                <div class="value" id="uploadSpeed">-- <span class="unit">Мбит/с</span></div>
                                <div class="alert-block"
                                    onclick="alert('Данная функция в разработке! Результат может быть не точным!')">
                                    <p>Исходящая</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960"
                                        width="40px" fill="#BB271A">
                                        <path
                                            d="m379.33-339.33 355-355q10-10 23.67-10 13.67 0 23.67 10 10 10 10 23.83 0 13.83-10 23.83l-379 379.34q-10 10-23.34 10-13.33 0-23.33-10L177.33-446q-10-10-9.5-23.83.5-13.84 10.5-23.84t23.84-10q13.83 0 23.83 10l153.33 154.34ZM584.83-97Q528-153.33 528-233.33q0-80.34 56.83-137.17 56.84-56.83 136.5-56.83 79.67 0 136.5 56.83 56.84 56.83 56.84 137.17 0 80-56.84 136.33Q801-40.67 721.33-40.67q-79.66 0-136.5-56.33Zm136.5-21q8.67 0 15-6 6.34-6 6.34-15.33 0-9.34-6.34-15.34-6.33-6-15-6-9.33 0-15.33 6t-6 15.34q0 9.33 6 15.33t15.33 6Zm0-83.33q8 0 13-5.34 5-5.33 5-13.33v-112q0-8-5.33-13t-13.33-5q-8 0-13 5.33-5 5.34-5 13.34v112q0 8 5.33 13t13.33 5Z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>`
const DSGN3_html = `<div class="results">
                    <div class="internet-bar">
                        <div id="it-bar-1" class="it-bar-section it-bar-1">Сеть: Не определена</div>
                        <div id="it-bar-2" class="it-bar-section it-bar-2">Конфиг</div>
                    </div>
                    <div class="displays">
                        <div class="result-card dwn-card">
                            <div class="display--DSGN3">
                                <div class="d-elem n-5 dwn"></div>
                                <div class="d-elem n-4 dwn"></div>
                                <div class="d-elem n-3 dwn"></div>
                                <div class="d-elem n-2 dwn"></div>
                                <div class="d-elem n-1 dwn"></div>
                            </div>
                            <div class="value" id="downloadSpeed">-- <span class="unit">Мбит/с</span></div>
                            <div class="alert-block"
                                onclick="alert('Данная функция в разработке! Результат может быть не точным!')">
                                <p>Входящая</p>
                            </div>
                        </div>
                        <div class="result-card ping-card">
                            <div class="display--DSGN3">
                                <div class="d-elem n-5 ping"></div>
                                <div class="d-elem n-4 ping"></div>
                                <div class="d-elem n-3 ping"></div>
                                <div class="d-elem n-2 ping"></div>
                                <div class="d-elem n-1 ping"></div>
                            </div>
                            <div class="value" id="ping">-- <span class="unit">мс</span></div>
                            <p>Пинг</p>
                        </div>
                        <div class="result-card mode-card">
                            <div class="display--DSGN3">
                                <div class="d-elem n-5-dis mode"></div>
                                <div class="d-elem n-4 mode"></div>
                                <div class="d-elem n-3 mode"></div>
                                <div class="d-elem n-2 mode"></div>
                                <div class="d-elem n-1 mode"></div>
                            </div>
                            <div class="value" id="networkMode" style="font-size: 18px;">--</div>
                            <p>Режим сети</p>
                        </div>
                        <div class="result-card proto-card">
                            <ul class="proto-list">
                                <li>
                                    <div class="n2 proto-test">DNS</div>
                                </li>
                                <li>
                                    <div class="n3 proto-test">HTTP</div>
                                </li>
                                <li>
                                    <div class="n4 proto-test">HTTPS</div>
                                </li>
                            </ul>
                            <div class="value" id="proto">-- <span class="proto-static-test">доступно</span>
                            </div>
                            <p>Протоколы</p>
                        </div>
                        <div class="result-card" style="display: none;">
                            <div class="display--DSGN3">
                                <div class="d-elem n-5 up"></div>
                                <div class="d-elem n-4 up"></div>
                                <div class="d-elem n-3 up"></div>
                                <div class="d-elem n-2 up"></div>
                                <div class="d-elem n-1 up"></div>
                            </div>
                            <div class="value" id="uploadSpeed">-- <span class="unit">Мбит/с</span></div>
                            <div class="alert-block"
                                onclick="alert('Данная функция в разработке! Результат может быть не точным!')">
                                <p>Исходящая</p>
                                <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960"
                                    width="40px" fill="#BB271A">
                                    <path
                                        d="m379.33-339.33 355-355q10-10 23.67-10 13.67 0 23.67 10 10 10 10 23.83 0 13.83-10 23.83l-379 379.34q-10 10-23.34 10-13.33 0-23.33-10L177.33-446q-10-10-9.5-23.83.5-13.84 10.5-23.84t23.84-10q13.83 0 23.83 10l153.33 154.34ZM584.83-97Q528-153.33 528-233.33q0-80.34 56.83-137.17 56.84-56.83 136.5-56.83 79.67 0 136.5 56.83 56.84 56.83 56.84 137.17 0 80-56.84 136.33Q801-40.67 721.33-40.67q-79.66 0-136.5-56.33Zm136.5-21q8.67 0 15-6 6.34-6 6.34-15.33 0-9.34-6.34-15.34-6.33-6-15-6-9.33 0-15.33 6t-6 15.34q0 9.33 6 15.33t15.33 6Zm0-83.33q8 0 13-5.34 5-5.33 5-13.33v-112q0-8-5.33-13t-13.33-5q-8 0-13 5.33-5 5.34-5 13.34v112q0 8 5.33 13t13.33 5Z" />
                                </svg>
                            </div>
                        </div>
                    </div>`
function selectDSGN(dsgnID) {
    if (dsgnID == 'dsgn2') {
        displays.innerHTML = DSGN2_html
        localStorage.setItem("theme", dsgnID);
        currentdsgn = 'dsgn2'
    }
    else {
        if (dsgnID == 'dsgn3') {
            displays.innerHTML = DSGN3_html
            localStorage.setItem("theme", dsgnID);
            currentdsgn = 'dsgn3'
        }
        else {
            displays.innerHTML = DSGN1_html
            localStorage.setItem("theme", dsgnID);
            currentdsgn = 'dsgn1'
        }
    }
    updateVisibilityByPreset()
}
let theme = localStorage.getItem("theme");
if (theme) {
    selectDSGN(theme);
}
else {
    selectDSGN('dsgn1');
}
