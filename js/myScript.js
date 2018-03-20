jQuery(document).ready(function($) {

    const TopTen = $("button.view10");
    const TopTenSection = $("div#TopTenScreen");
    const NameInput = $("input#currencyName");
    const specificCurren = $("#specificCurrencyData");
    const CurrencyConverter = $("<select class='col-3' id='currencyConverter'><option selected disabled> Select Currency </option></select>");
    const Currencies = ["AUD", "BRL", "CAD", "CHF", "CLP", "CNY", "CZK", "DKK", "EUR", "GBP", "HKD", "HUF", "IDR", "ILS", "INR", "JPY", "KRW", "MXN", "MYR", "NOK", "NZD", "PHP", "PKR", "PLN", "RUB", "SEK", "SGD", "THB", "TRY", "TWD", "ZAR"];
    let SpecificChosenCurrencyid;

    for (var i = 0; i < Currencies.length; i++) {
    	$("<option>" + Currencies[i] + "</option>").appendTo(CurrencyConverter);
    }



    TopTen.on("click", getfirstten);

    NameInput.keyup(function(event) {

        let nameCheck = NameInput.val();
        if (NameInput.val() === "") {
            if ($("#suggestedCurrList")) {
                $("#suggestedCurrList").remove();
            }
        } else {
            checkCurrencyExist(nameCheck);
        }
    });

    CurrencyConverter.change(function(event) {
    	let TargetCurrency = event.target.selectedOptions[0].value;

    	$.get(" https://api.coinmarketcap.com/v1/ticker/" + SpecificChosenCurrencyid + "/?convert=" + TargetCurrency , function(data){
    		let targetPrice = "price_" + TargetCurrency.toLowerCase(); 
    		let convertedPrice = $("<p class='newPrice'>" + data[0][targetPrice] + " " + TargetCurrency + "</p>");

    		convertedPrice.appendTo(specificCurren);
    	});
    });

    function getfirstten() {

        $.get("https://api.coinmarketcap.com/v1/ticker/?limit=10", function(data, success) {

            if($(".single-item.col-3")){
                $(".single-item.col-3").remove();
            }
            for (var i = 0; i < data.length; i++) {

                let name = data[i].name;
                let USDprice = data[i].price_usd;

                let nameContainer = $("<h3 class='currency-name'>" + name + "</h3>");
                let priceContainer = $("<p class='usd-price'>" + USDprice + "</p>");
                let item = $("<div class='single-item col-3'></div>");


                nameContainer.appendTo(item);
                priceContainer.appendTo(item);
                item.appendTo(TopTenScreen);
            }

            TopTenScreen.style.maxHeight = "800px" ;

        });
    }

    function checkCurrencyExist(name) {

        $.get("https://api.coinmarketcap.com/v1/ticker/", function(data) {
            const currArr = [];
            for (var i = 0; i < data.length; i++) {

                let CurencyNameObtained = data[i].name;

                if (CurencyNameObtained.toLowerCase().indexOf(name) === 0) {
                    currArr.push(CurencyNameObtained);
                }
            }

            createList(currArr);

        });
    }

    function createList(arr) {


        if ($("#suggestedCurrList")) {
            $("#suggestedCurrList").remove();
        }

        const currencyList = $("<ul id='suggestedCurrList'></ul>");
        for (var i = 0; i < arr.length; i++) {
            let listItem = $("<li class='suggested-currency'>" + arr[i] + "</li>");
            listItem.appendTo(currencyList);
            currencyList.appendTo(specificCurren);
        }

        const singleSuggestedCurrency = $("#suggestedCurrList>li");
        singleSuggestedCurrency.click(function(event) {
            displayChoice(event);
        });

    }

    function displayChoice(e) {
        let choice = e.target.innerHTML;
        NameInput.val(choice);
        $("#suggestedCurrList").remove();
        SpecificChosenCurrencyid = choice.toLowerCase().replace(" ","-");
        viewSpecificCurrencyDetails(SpecificChosenCurrencyid);
        console.log(SpecificChosenCurrencyid);
    }

    function viewSpecificCurrencyDetails(id) {

    	if($("#specific-currency-container")){
    		$("#specific-currency-container").remove();
    	}

        $.get("https://api.coinmarketcap.com/v1/ticker/" + id + "/", function(data) {
            let SpecificCurrency = data[0];

            let name = $("<h5 class='col-3'>" + SpecificCurrency.name + "</h5>");
            let BTCprice = $("<p class='btc-price col-3'>" + SpecificCurrency.price_btc + "</p>");
            let USDprice = $("<p class='usd-price col-3'>" + SpecificCurrency.price_usd + "</p>");
            let SpecificCurrencyContainer = $("<div class='row' id='specific-currency-container'></div>");

            name.appendTo(SpecificCurrencyContainer);
            BTCprice.appendTo(SpecificCurrencyContainer);
            USDprice.appendTo(SpecificCurrencyContainer);
            CurrencyConverter.appendTo(SpecificCurrencyContainer);


            SpecificCurrencyContainer.appendTo(specificCurren);
        });
    }

});