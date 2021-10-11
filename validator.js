// formSelector là cái form mà ta truyền vào để validate (như ở file html ta truyền id của form)
function Validator(formSelector) {
    // console.log(formSelector);

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
                // Check các rules nếu phát hiện có rule chứa dấu ':' thì tách ra nửa, mục đích là tách min:6 hoặc max:50 chẳng hạn
                if(rule.includes(':')) {
                    var ruleInfo = rule.split(':');
                    // console.log(ruleInfo);

                    // Sau khi tách ra 'min:6' ra rồi thì gán đè rule thành giá trị đầu của chuỗi vừa tách (chỉ lấy 'min')
                    // Chí lấy giá trị đầu trong Array chứa các chuỗi vừa tách ra thôi (min/max)
                    // Nếu 'max/min' là 'ruleInfo[0]', thì giá trị truyền vào của 'max/min' là 'ruleInfo[1]'
                    rule = ruleInfo[0];
                }
                // console.log(rule);
            }
            formRules[input.name] = input.getAttribute('rules');
        }
        // Ta đã nhận dc Object chứa các key là 'name' của input và tương ứng các value là các 'rules' của tất cả các thẻ input
        console.log(formRules);

    }
}