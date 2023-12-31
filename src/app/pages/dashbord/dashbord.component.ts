import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PostService } from 'src/app/srvices/post.service';

@Component({
  selector: 'app-dashbord',
  templateUrl: './dashbord.component.html',
  styleUrls: ['./dashbord.component.scss']
})
export class DashbordComponent implements OnInit {

  data: any[] = [];
dropdownOptions: { text: string; value: number }[] = [
  { text: 'אישור הפוסט', value: 1 },
  { text: 'בפרטי הדירה', value: 2 },
  { text: 'בתאיכים', value: 3 },
  { text: 'שכירות', value: 4 },
  { text: 'תעודה מזהה', value: 5 },
  { text: 'שפה לא נאותה', value: 6 },
];
submissionForm!: FormGroup ;


constructor(private postService: PostService, private formBuilder: FormBuilder) {
  this.submissionForm = this.formBuilder.group({
    selectedOption: [''], // Initialize with an empty string or a default value
  });
}
  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
   
    this.postService.getPostsNotConfirmed().subscribe((response) => {
      this.data = response.map((item) => {
        const formGroup = this.formBuilder.group({
          selectedOption: [''],
        });
        return { ...item, formGroup };
      });
      console.log('this.data', this.data);
    });
      // this.data = response; 
      // console.log('this.data',this.data)
    // });
  }



  send(selectedOption: number, userId: string, postId: string) {
    console.log('User ID:', userId);
    console.log('Post ID:', postId);
    console.log('Selected Option:', selectedOption);
    const update={
      user_id:userId,
      post_id:postId,
      confirm_status:selectedOption
    }


    this.postService.updateConfirmStatus(update).subscribe(
      (response) => {
        console.log('Form submitted successfully:', response);
       
      },
      (error) => {
       
        console.error('Error submitting form:', error);
      }
    );

  }

}
