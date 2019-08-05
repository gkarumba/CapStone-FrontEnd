import { Component, Input, EventEmitter, Output, OnInit } from "@angular/core";
import * as Survey from "survey-angular";
import * as widgets from "surveyjs-widgets";
import { AnswersService } from '../../../services/answers.service';
import { SurveyService } from "../../../services/survey.service";
import { AuthService } from '../../../services/auth.service';

import "inputmask/dist/inputmask/phone-codes/phone.js";

widgets.icheck(Survey);
widgets.select2(Survey);
widgets.inputmask(Survey);
widgets.jquerybarrating(Survey);
widgets.jqueryuidatepicker(Survey);
widgets.nouislider(Survey);
widgets.select2tagbox(Survey);
widgets.signaturepad(Survey);
widgets.sortablejs(Survey);
widgets.ckeditor(Survey);
widgets.autocomplete(Survey);
widgets.bootstrapslider(Survey);
widgets.prettycheckbox(Survey);

Survey.JsonObject.metaData.addProperty("questionbase", "popupdescription:text");
Survey.JsonObject.metaData.addProperty("page", "popupdescription:text");

@Component({
  selector: 'app-editsurvey',
  templateUrl: './editsurvey.component.html',
  styleUrls: ['./editsurvey.component.css']
})
export class EditsurveyComponent implements OnInit {
  @Output() submitSurvey = new EventEmitter<any>();
  json;
  answer;
  category;
  school;
  answers = { 'school': 0, 'category': 0, 'answer': '' };
  constructor(private answerservice: AnswersService, private surveyservice: SurveyService, private authService: AuthService) { }

  ngOnInit() {
    this.json = this.answerservice.getQuestions();
    console.log(this.json)
    this.answer = this.surveyservice.getAnswers();
    const surveyModel = new Survey.Model(this.json);
    console.log(this.answer)
    // surveyModel.currentPageNo = this.answer.currentPageNo
    surveyModel.data = this.answer
    surveyModel.onAfterRenderQuestion.add((survey, options) => {
      if (!options.question.popupdescription) {
        return;
      }

      // Add a button;
      const btn = document.createElement("button");
      btn.className = "btn btn-info btn-xs";
      btn.innerHTML = "More Info";
      const question = options.question;
      btn.onclick = function () {
        // showDescription(question);
        alert(options.question.popupdescription);
      };
      const header = options.htmlElement.querySelector("h5");
      const span = document.createElement("span");
      span.innerHTML = "  ";
      header.appendChild(span);
      header.appendChild(btn);
    });
    surveyModel.onComplete.add((result) => {
      this.submitSurvey.emit(result.data);
      this.school = parseInt(this.authService.getUserId());
      this.answers.school = this.school
      this.category = this.surveyservice.getCategoryId();
      this.answers.category = this.category;
      this.answers['answer'] = result.data;
      console.log(this.answers)
      // this.onSurveyUpdate(this.answer);
    })
    Survey.SurveyNG.render("surveyElement", { model: surveyModel });
  }
  onSurveyUpdate(survey) {
    this.surveyservice.saveAnswers(survey)
      .subscribe(
        res => console.log(res),
        err => console.log(err)
      );
  }

}
