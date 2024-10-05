// document.getElementsByClassName("ContributionCalendar-grid js-calendar-graph-table")[0].children[2]
// <td style="width: 10px" id="contribution-day-component-{Y}-{X}" class="ContributionCalendar-day" data-level="{COLOR}"></td>

function addRow(row_num) {
    row = document.createElement("tr")
    row.style = "height: 10px"
    row.appendChild(document.createElement("td"))
    for (let i = 0; i < 52; i++) {
        const cell = document.createElement("td")
        cell.className = "ContributionCalendar-day"
        cell.setAttribute("data-level", 0)
        cell.setAttribute("id", `contribution-day-component-${row_num}-${i}`)
        row.appendChild(cell)
    }
    document.getElementsByClassName("ContributionCalendar-grid js-calendar-graph-table")[0].children[2].appendChild(row)
}

function setCellLevel(x, y, level) {
    const cell = document.getElementById(`contribution-day-component-${y}-${x}`)
    if (cell != undefined) {
        cell.setAttribute("data-level", level)
    }
}

function clearCells() {
    for (let i = 0; i < 39; i++) {
        for (let j = 0; j < 52; j++) {
            setCellLevel(j, i, 0)
        }
    }
}

function advanceFrame() {
    let frame = data[frame_num]
    frame_num += 1
    for (let i = 0; i < 5; i++) {
        if (frame[i] == undefined) {
            continue
        }
        for (let j = 0; j < frame[i].length; j++) {
            let y = parseInt(frame[i][j] / 52)
            let x = frame[i][j] % 52
            setCellLevel(x, y, i)
        }
    }
    if (frame_num >= frame_count) {
        frame_num = 0
        clearCells()
        clearInterval(interval)
    }
}

data = // TODO: change to fecth from github


// should just be 7
current_rows = document.getElementsByClassName("ContributionCalendar-grid js-calendar-graph-table")[0].children[2].rows.length
for (let i = current_rows; i < 39; i++) {
    addRow(i)
}
frame_num = 0
frame_count = data.length
console.log(`estmated ${frame_count / 30}s long`)
clearCells()
interval = setInterval(advanceFrame, 1000 / 30)
