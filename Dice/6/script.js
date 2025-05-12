jQuery(function ($) {
    const dice = ["blank", "shield", "shield", "skull", "skull", "skull"];
    const dice_lookup = { blank: 0, shield: 1, skull: 2 };
    const roll_time = 5000; // How long the dice spins
    const roll_speed = 150; // How fast the dice spins
    const allow_repeat = false; // Allow the same result consecutively? false = Two spins will never yield duplicate results. true = Duplicate consecutive results are allowed.

    $(document).on("click", ".roll-dice", function (event) {
        event.preventDefault();
        let _this = $(this);
        if (_this.hasClass("rolling")) {
            return false;
        }
        _this.addClass("rolling");
        shuffle(dice);
        const dice_interval = setInterval(roll_dice, roll_speed);
        const dice_timeout = setTimeout(stop_dice, roll_time);

        function stop_dice() {
            clearInterval(dice_interval);
            let skulls = 0;
            let shields = 0;
            $(".dice-wrapper").each(function (index, element) {
                $(this).addClass("rolling");
                var p = $(this).data().prevroll;
                var r = $(this).data("roll");
                shuffle(dice);
                while (dice[0] == p && !allow_repeat) { // Repeats not allowed.
                    shuffle(dice);
                    r += 50;
                    $(this).css({ transform: "rotate(" + r + "deg)" });
                }
                const result = dice[0];
                $(this).css({ transform: "rotate(0deg)" });
                $(this)
                    .data({ roll: r, prevroll: dice[0], result: result })
                    .html(
                        '<i class="the-dice fa-solid fa-' +
                          (result === "skull" ? "skull" : result === "shield" ? "shield-alt" : "") +
                          '" data-result="' +
                          result +
                          '"></i>'
                    )
                    .removeClass("rolling");
                if (result === "skull") skulls++;
                if (result === "shield") shields++;
            });
            _this.removeClass("rolling");
            $(".dice-result").html("Skulls: " + skulls + "<br>Shields: " + shields);
        }

        function roll_dice() {
            $(".dice-wrapper").each(function (index, element) {
                var r = eval($(this).data("roll"));
                var icon = $(this).find(".the-dice");
                shuffle(dice);
                r += 50;
                $(this)
                    .addClass("rolling")
                    .html('<i class="the-dice fa-solid fa-' +
                          (dice[0] === "skull" ? "skull" : dice[0] === "shield" ? "shield-alt" : "") +
                          '"></i>')
                    .data({ roll: r })
                    .css({ transform: "rotate(" + r + "deg)" });
                icon.addClass("fa-" + (dice[0] === "skull" ? "skull" : dice[0] === "shield" ? "shield-alt" : ""));
            });
        }
    });

    $(document).on("change", ".dice-number", function (event) {
        set_dice();
    });

    function set_dice() {
        var dice_num = $(".dice-number").val(),
            html = "";
        $(".dice-wrapper").remove();
        for (var i = 0; i < dice_num; i++) {
            html +=
                '<div class="dice-wrapper" data-roll="0"><i class="the-dice fa-solid fa-' +
                (dice[0] === "skull" ? "skull" : dice[0] === "shield" ? "shield-alt" : "") +
                '" data-roll="0"></i></div>';
        }
        $(html).appendTo(".dice-container");
    }

    function shuffle(array) {
        let currentIndex = array.length;
        while (currentIndex != 0) {
            let randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex],
                array[currentIndex]
            ];
        }
    }
    // INIT
    set_dice();
});
