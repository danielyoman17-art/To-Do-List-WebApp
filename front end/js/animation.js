$('#toggler-mode').click(()=>{
    $('body').toggleClass('dark')
    $('.toggler').toggleClass('active')
})

$('#toggler-dropdown').click(()=>{
    $(".dropdown").addClass('active')
    $('.overlay').css('display','block')
})

$('.overlay').click(()=>{
    $(".dropdown").removeClass('active')
    $('.overlay').css('display','none')
})


$('.popup').addClass('show')
$('.popup').delay(4000).queue(()=>{
    $('.popup').removeClass('show')
})

$('#close').click(()=>{
    $('.popup').removeClass('show')
})

$('.modal-overlay').hide()
$('.btn-add').click(()=>{
    $('.modal-overlay').fadeIn()
})



document.querySelector('#cancel , .modal-overlay , #addTask').addEventListener('click',(e)=>{
    if(e.target === document.querySelector('.modal-overlay') || e.target === document.querySelector('#cancel') || e.target === document.querySelector('#addTask')){
        $('.modal-overlay').fadeOut()
        document.querySelector('#input-task').value = ''
    }
})