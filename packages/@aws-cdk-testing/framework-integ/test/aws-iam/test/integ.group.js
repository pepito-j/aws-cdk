"use strict";
// Creates a default group, with no users and no policy attached.
Object.defineProperty(exports, "__esModule", { value: true });
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const aws_iam_1 = require("aws-cdk-lib/aws-iam");
const app = new aws_cdk_lib_1.App();
const stack = new aws_cdk_lib_1.Stack(app, 'integ-iam-role-1');
new aws_iam_1.Group(stack, 'MyGroup');
new integ_tests_alpha_1.IntegTest(app, 'iam-role-1', {
    testCases: [stack],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZ3JvdXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5ncm91cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsaUVBQWlFOztBQUVqRSw2Q0FBeUM7QUFDekMsa0VBQXVEO0FBQ3ZELGlEQUE0QztBQUU1QyxNQUFNLEdBQUcsR0FBRyxJQUFJLGlCQUFHLEVBQUUsQ0FBQztBQUV0QixNQUFNLEtBQUssR0FBRyxJQUFJLG1CQUFLLENBQUMsR0FBRyxFQUFFLGtCQUFrQixDQUFDLENBQUM7QUFFakQsSUFBSSxlQUFLLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBRTVCLElBQUksNkJBQVMsQ0FBQyxHQUFHLEVBQUUsWUFBWSxFQUFFO0lBQy9CLFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQztDQUNuQixDQUFDLENBQUM7QUFFSCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDcmVhdGVzIGEgZGVmYXVsdCBncm91cCwgd2l0aCBubyB1c2VycyBhbmQgbm8gcG9saWN5IGF0dGFjaGVkLlxuXG5pbXBvcnQgeyBBcHAsIFN0YWNrIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgSW50ZWdUZXN0IH0gZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMtYWxwaGEnO1xuaW1wb3J0IHsgR3JvdXAgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcblxuY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuXG5jb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdpbnRlZy1pYW0tcm9sZS0xJyk7XG5cbm5ldyBHcm91cChzdGFjaywgJ015R3JvdXAnKTtcblxubmV3IEludGVnVGVzdChhcHAsICdpYW0tcm9sZS0xJywge1xuICB0ZXN0Q2FzZXM6IFtzdGFja10sXG59KTtcblxuYXBwLnN5bnRoKCk7XG4iXX0=