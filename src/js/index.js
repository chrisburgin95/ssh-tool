(function(){
  // requires
  const render = require('./render.min.js');
  const data = require('./data.min.js');

  var terminal = require('child_process').spawn('bash');
  // function

  terminal.stdout.on('data', function (data) {
    console.log(data);
});


  // init/listeners
  const init = function init(){
    // initial render of machines
    //data.add_machine('Title1', '125.12.32.2', 'root');

    render.machines(function(machine_html){
      $('.machines').prepend(machine_html);
    });


    // listeners
    // settings cog
    $("body").on('click', '.machine .functions .gear', function (event){
      // select parent element
      let el = $(this).parent().parent();

      // toggle everything open or closed
      el.toggleClass('editing');
      el.children('.functions').toggleClass('visible');
    });

    // edit
    $("body").on('click', '.machine .functions .edit', function (event){
      // select parent element
      let el = $(this).parent().parent();

      // add editing
      $('.add_machine_dialog').addClass('edit');

      //set data-id
      $('.add_machine_dialog').attr('data-id', el.attr('data-id'));

      // reset inputs
      $('.add_machine_dialog form input[type=text]').val('');

      data.fetch_machine(el.attr('data-id'), function(machine){
        // set inputs
        $('.add_machine_dialog .title').val(machine.title);
        $('.add_machine_dialog .ip').val(machine.ip);
        $('.add_machine_dialog .user').val(machine.user);

        // show
        $('.add_machine_dialog').toggleClass('visible');
      });

    });

    // trash
    $("body").on('click', '.machine .functions .trash', function (event){
      // select parent element
      let el = $(this).parent().parent();

      // toggle everything open or closed
      console.log('trash');
    });

    // show machine dialog - add
    $("body").on('click', '.search_wrapper .add_icon, .add_machine_dialog .back_button img', function (event){
      // show
      $('.add_machine_dialog').toggleClass('visible');

      //remove editing
      $('.add_machine_dialog').removeClass('edit');

      //reset data-id
      $('.add_machine_dialog').attr('data-id', '');

      // reset inputs
      $('.add_machine_dialog form input[type=text]').val('');
    });

    // add form submit
    $("body").on('submit', '.add_machine_dialog form', function (event){
      event.preventDefault();

      // set data
      let title = $(this).children('.title').val();
      let ip = $(this).children('.ip').val();
      let user = $(this).children('.user').val();

      // add/edit machine
      if ($('.add_machine_dialog').hasClass('edit')){
        // editing
        console.log($(this).parent().attr("data-id"));
        data.update_machine($(this).parent().attr("data-id"), title, ip, user);
      } else {
        // creating new
        data.add_machine(title, ip, user);
      }

      // render machines
      render.machines(function(machine_html){
        $('.machines').html('');
        $('.machines').prepend(machine_html);
      });

      $('.add_machine_dialog').removeClass('visible');
    });

  }; init();

}());
