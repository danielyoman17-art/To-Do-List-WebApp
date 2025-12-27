$('#toggler-dropdown').click(()=>{
    $(".dropdown").addClass('active')
    $('.overlay').css('display','block')
})

$('.overlay').click(()=>{
    $(".dropdown").removeClass('active')
    $('.overlay').css('display','none')
})


$('.popup').addClass('show')
$('.popup').delay(3000).queue(()=>{
    $('.popup').removeClass('show')
})

$('#close').click(()=>{
    $('.popup').removeClass('show')
})

$('.modal-overlay').hide()
$('.btn-add').click(()=>{
    $('.modal-overlay').fadeIn()
})



