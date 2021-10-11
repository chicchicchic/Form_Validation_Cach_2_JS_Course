'use strict'

// formSelector là cái form mà ta truyền vào để validate (như ở file html ta truyền id của form)
function Validator(formSelector) {
    // console.log(formSelector);


    // Func này nhầm mục đích từ thẻ input => chọc ra thẻ cha chứa nó => lấy ra element cần select
    function getParent(element, selector){
        // Vòng lặp while này sẽ chạy khi mà có parent của element (element.parentElement)
        while (element.parentElement) {
            // Check nếu nó matches vs 'selector' thì return lại chính element
            if(element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            // Nếu ko có selector ở lần lặp đầu thì gán element bằng với element cha của nó, và quay lại vòng lặp, hiện tại thì element là thẻ cha thì nó lặp tiếp và kiếm xem thẻ chứa nó có matches với selector hay ko, nếu ko thì gán như vậy, làm như vậy để phòng khi thẻ input (element) của ta nó nằm trong nhiều thẻ cha trong thẻ chứa class 'form-group', nó cứ lặp dần dần ra ngoài để nó kiếm thẻ chứa class 'form-group'
            element = element.parentElement;
        }
    }

    // Chuyển đổi thành dạng Object chứa tất cả các rules cho việc validation trong form
    // Mong muốn trong Object  ó chứa như này:
    // có key = tên của attribute 'name' và value = giá trị của attribute 'rule'
    // fullname: 'required',
    // email: 'required|email'
    var formRules = {}; 


    /**
     * Quy ước tạo rules ('validatorRules')
     * -Nếu có lỗi => return 'error message'
     * -Nếu ko lỗi => return 'undefind'
     */
    var validatorRules = {
        // value này là gia trị mà User nhập vào field nếu field đó có rule 'required'
        required: function(value) {
            return value ? undefined : 'Vui lòng nhập trường này';
        },
        // value này là gia trị mà User nhập vào field nếu field đó có rule 'email'
        email: function(value) {
            // search 'javascript email regex' và lấy chuỗi biểu thức chính qui ở link 'https://www.w3resource.com/javascript/form/email-validation.php'
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : 'Vui lòng nhập đúng cú pháp email';
        },
        // value này là gia trị mà User nhập vào field nếu field đó có rule 'min'
        min: function(min) {
            // return ra 1 function khác để nhận value User nhập vào và so sánh vs min
            return function(value) {
                return value.length >= min ? undefined : `Nhập ít nhất ${min} ký tự`;
            }
        },
        // value này là gia trị mà User nhập vào field nếu field đó có rule 'max'
        max: function(max) {
            // return ra 1 function khác để nhận value User nhập vào và so sánh vs min
            return function(value) {
                return value.length <= max ? undefined : `Nhập tối đa ${max} ký tự`;
            }
        },
    };

    // Lấy ra form element trong DOM theo formSelector
    var formElement = document.querySelector(formSelector);
    // console.log(formElement);

    // Check để xử lý chỉ khi có element trong DOM
    if(formElement) {

        // Lấy ra tất cả thẻ có attribute là 'name' và 'rule' trong formElement
        var inputs = formElement.querySelectorAll('[name][rules]');
        // console.log(inputs);

        for(var input of inputs) {
            // console ra sẽ thấy nó trả ra từng input trong form của mình
            // muốn lấy ra 'name' thì 'input.name'
            // nhưng muốn lấy 'rules' thì ko dc 'input.rules' vì attribute 'name' là attribute hợp lệ của thẻ input, còn attribute 'rules' là ta tự định nghĩa ra, muốn lấy ra attribute 'rules' thì 'input.getAttribute('rules')'
            // console.log(input.name);
            // console.log(input.getAttribute('rules'));


            // Tách ra từng chuỗi cách nhau bởi dấu |
            // Mục tiêu là ['required', 'email'] thay vì là 'required|email' như ban đầu
            var rules = input.getAttribute('rules').split('|');
            // console.log(rules);
            for (var rule of rules) { 

                // Tách 'ruleInfo' ra ngoài để cho biến này hoặc động linh hoạt hơn
                var ruleInfo;
                // isRuleHasValue là cái rule mà cần value (min/max)
                var isRuleHasValue = rule.includes(':');


                // Check các rules nếu phát hiện có rule chứa dấu ':' thì tách ra nửa, mục đích là tách min:6 hoặc max:50 chẳng hạn
                if(isRuleHasValue) {
                    ruleInfo = rule.split(':');
                    // console.log(ruleInfo);

                    // Sau khi tách ra 'min:6' ra rồi thì gán đè rule thành giá trị đầu của chuỗi vừa tách (chỉ lấy 'min')
                    // Chí lấy giá trị đầu trong Array chứa các chuỗi vừa tách ra thôi (min/max)
                    // Nếu 'max/min' là 'ruleInfo[0]', thì giá trị truyền vào của 'max/min' là 'ruleInfo[1]'
                    rule = ruleInfo[0];

                    // Console ra để thấy là nó trả về min/max chứ nó ko return func bên trong nó, nhưng ra muốn nó return func bên trong nó như thằng 'required' và 'email', vì min/max nó có khác vs required và email nên ta phải làm như vậy
                    // Ta truyển tham số vào min, nếu min thì 'ruleInfo[0])', còn value của nó là 'ruleInfo[1])'
                    // console.log(validatorRules[rule](ruleInfo[1]));
                }


                var ruleFunc = validatorRules[rule];

                if(isRuleHasValue) {
                    // Trước khi push 'ruleFunc' vào 'formRules[input.name]' thì gán bằng chính nó và run nó
                    // Vì nó là func lồng nhau nên phải làm vậy
                    ruleFunc = ruleFunc(ruleInfo[1]);
                }


                // console.log(rule);

                // Check nếu 'formRules[input.name]' mà là Array thì 
                if(Array.isArray(formRules[input.name])) {
                    // Từ lần thứ 2 thì push nó vào chứ ko gán như else nữa
                    formRules[input.name].push(ruleFunc);

                }
                // Lần đầu formRules nó là Object trống nên nó lọt vào else, và tại else này ra gán cho nó giá trị là Array
                else {
                    // console.log(rule);
                    // 'validatorRules[rule]' là function mà ta muốn đưa vào Array
                    // console.log(validatorRules[rule]);

                    formRules[input.name] = [ruleFunc];
                }
            }

            // Trong vòng for mình đã lướt qua các thẻ input rồi, thì bây giờ mình lắng nghe để validate (vd: onblur, onchange, ...)
            // Khi input dc blur thì gán cho nó func 'handleValidate'
            input.onblur = handleValidate;   
        }


        // Viết func 'handleValidate' ngoài đây, để thực hiện validate
        function handleValidate(e) {
            // console.log(e);
            // Từ event lấy ra element thì .target
            // console.log(e.target);
            // Từ Element đã blur muốn lấy ra value user nhập trước khi blur thì .value, ko nhập gì vào field mà blur thì trả về chuỗi rỗng, còn nhập giá trị gì đó rồi blur thì nó trả về đúng giá trị vừa nhập
            // console.log(e.target.value);
            // Từ element muốn lấy ra 'name' thì .name (fullname, email, password)
            // console.log(e.target.name);
            // Để lấy ra rule của chính field mà ta blur thì 'formRules[e.target.name]'
            // console.log(formRules[e.target.name]);


            var rules = formRules[e.target.name];
            // Tách errorMessage ra
            var errorMessage;


            rules.find(function (rule) {
                // tham số rule nhận vào là các rule (required, email, min/max), nên rule nào cũng nhận vào value
                // Khi field nào có error thì nó sẽ gán cho errorMessage luôn và return ra error message
                errorMessage = rule(e.target.value);
                return errorMessage;
            });

            // some sẽ chạy và nó tìm nếu có errorMessage thì nó sẽ dừng luôn vòng lặp và trả về error message cho mình (tab console)
            // console.log(errorMessage);

            // Check nếu có error message thì hiển thị error Message ra UI
            if (errorMessage) {
                // console.log(e.target);

                var formGroup = getParent(e.target, '.form-group');
                // console.log(formGroup);

                // Check nếu có formGroup (thẻ cha của input dc User blur) thì:
                if(formGroup) {
                    // Chọc vào thẻ chứa thông báo lỗi chứa class 'form-message'
                    var formMessage = formGroup.querySelector('.form-message');
                    if(formMessage) {
                        formMessage.innerText = errorMessage;
                    }
                }
            }



        }

        // Ta đã nhận dc Object chứa các key là 'name' của input và tương ứng các value là các 'rules' của tất cả các thẻ input
        // console.log(formRules);

    }
}