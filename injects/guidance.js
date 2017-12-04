const triggerListener = (e) => {
    baundDogGuidance.style.width = null
    baundDogGuidance.style.height = null
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

const baundDogGuidance = document.createElement('div')
baundDogGuidance.id = 'baund-dog-guidance'
baundDogGuidance.style.top = '0px'
baundDogGuidance.style.width = '100%'
baundDogGuidance.style.height = '100%'
baundDogGuidance.style.display = 'none'
document.getElementsByTagName('body')[0].appendChild(baundDogGuidance)
baundDogGuidance.addEventListener('click', triggerListener)
