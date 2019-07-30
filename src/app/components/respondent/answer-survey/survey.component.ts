import { Component, Input, EventEmitter, Output, OnInit } from "@angular/core";

import * as Survey from "survey-angular";
import * as widgets from "surveyjs-widgets";
import { SurveyService } from "../../../services/survey.service";
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Answers } from '../../../models/answers';

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
  // tslint:disable-next-line:component-selector
  selector: "survey",
  templateUrl: "./answer-survey.component.html"
})
export class SurveyComponent implements OnInit {
  @Output() submitSurvey = new EventEmitter<any>();
  // @Input() answers: Answers
  // @Input()
  // json: object;
  json;
  public  id: string;
  answer = {'school': 0 ,'category':0,'answer':''};
  category;
  school;

  constructor(private surveyservice: SurveyService,private route: ActivatedRoute,private authService: AuthService) {}


  click(result) {
    console.log(result);
  }

  ngOnInit() {
    // this.id = this.route.snapshot.paramMap.get('id');
    this.json = this.surveyservice.getQuestions();
    console.log(this.json)
    const surveyModel = new Survey.Model(this.json);
    surveyModel.onAfterRenderQuestion.add((survey, options) => {
      if (!options.question.popupdescription) {
        return;
      }

      // Add a button;
      const btn = document.createElement("button");
      btn.className = "btn btn-info btn-xs";
      btn.innerHTML = "More Info";
      const question = options.question;
      btn.onclick = function() {
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
      this.school = parseInt(this.authService.getUserId())
      // console.log(typeof this.school)
      this.answer.school = this.school
      // console.log(this.authService.getUserId())
      // console.log(this.surveyservice.getCategoryId())
      this.category = this.surveyservice.getCategoryId();
      this.answer.category = this.category
      // this.answer.school = parseInt(this.answer.school)
      // console.log(this.answer.school)
      // this.answers = this.answer
      // this.answers['school']= this.authService.getUserId();
      this.answer['answer'] = result.data;
      console.log(this.answer)
      this.onSurveySaved(this.answer);

    });
    // console.log(this.answers)
    Survey.SurveyNG.render("surveyElement", { model: surveyModel });

  }

  onSurveySaved(survey) {
    this.surveyservice.saveAnswers(survey)
      .subscribe(
        res => console.log(res),
        err => console.log(err)
      );

    // console.log(survey);
    // this.surveyservice.saveAnswers(survey);

  }

}