/*
// TODO "Client Injection code"
 */

// TODO split for usecases

function getXPathForElement(element) {
    const idx = (sib, name) => sib
        ? idx(sib.previousElementSibling, name || sib.localName) + (sib.localName == name)
        : 1;
    const segs = elm => !elm || elm.nodeType !== 1
        ? ['']
        : elm.id && document.querySelector(`#${elm.id}`) === elm
            ? [`id('${elm.id}')`]
            : [...segs(elm.parentNode), `${elm.localName.toLowerCase()}[${idx(elm)}]`];
    return segs(element).join('/');
}

function getElementByXPath(path) {
    return (new XPathEvaluator()).evaluate(path, document.documentElement, null,
        XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}


const triggerListener = (e) => {
    e.target.addEventListener('mouseover', () => {
        if (e.target.style.top === '0px') {
            e.target.style.top = null
            e.target.style.bottom = '0px'
        } else {
            e.target.style.top = '0px'
            e.target.style.bottom = null
        }
    })
    e.target.style.top = null
    e.target.style.bottom = '0px'
    e.target.removeEventListener('click', triggerListener)
}


const styleClass = {
    color: 'yellow',
    position: 'absolute',
    top: '0px',
    left: '0px',
    background: 'black',
    borderRadius: '6px',
    opacity: '0.6',
    padding: '30px 30px 20px 30px',
    fontSize: '60px',
}
const baundDogGuidance = document.createElement('div')
baundDogGuidance.id = 'baund-dog-guidance'
baundDogGuidance.innerText = '시작하려면 여기를 클릭하세요.'
Object.assign(baundDogGuidance.style, styleClass)
document.getElementsByTagName('body')[0].appendChild(baundDogGuidance)
baundDogGuidance.addEventListener('click', triggerListener)

let scenarioData = []
let currentStep = 0
let onElement
const listener = (e) => {
    const xpath = getXPathForElement(e.target)
    const currentScenario = scenarioData[currentStep]

    if (!currentScenario) {
        const url = 'http://localhost:10801/recorder/end'
        fetch(url, { method: 'GET' })
            .then(response => response.json())
            .then(data => console.log(data))
        return
    }
    const message = {
        type: 'bd-element-click',
        message: (currentScenario.text) ? currentScenario.text : '',
        xpath,
        scenarioData: currentScenario,
    }
    // console.log(message)
    if (currentScenario.intent && currentScenario.intent.search('Input') >= 0) {
        const value = Object.values(currentScenario.context)[1]
        const consoleMessage = {
            type: 'bd-element-type',
            text: value,
            action: 'type',
            xpath,
        }
        console.log(`bd-message::${JSON.stringify(consoleMessage)}`)
    }


    const initFetch = {
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(message),
    }
    // console.log("initFetch : " + JSON.stringify(initFetch))

    const url = 'http://localhost:10801/recorder/event'
    fetch(url, initFetch)
        .then(response => response.json())
        .then(data => console.log(data))

    currentStep += 1
    if (scenarioData.length > currentStep) {
        baundDogGuidance.innerText = scenarioData[currentStep].text
    }
}

document.body.addEventListener('mousemove', (e) => {
    const x = e.clientX
    const y = e.clientY
    const elementMouseIsOver = document.elementFromPoint(x, y)
    if (!elementMouseIsOver.isEqualNode(onElement)) {
        if (onElement) {
            onElement.style.border = 'none'
            onElement.removeEventListener('click', listener)
        }
        onElement = elementMouseIsOver
        onElement.style.border = '2px solid blue'
        onElement.addEventListener('click', listener)
    }
})
