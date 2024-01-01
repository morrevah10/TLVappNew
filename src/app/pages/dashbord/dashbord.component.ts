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
  filteredData: any[] = [];

  searchType: string = 'userId';
  searchInput: string = '';

  sortBy: string = 'userId';
  sortOrder: string = 'asc';

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
    selectedOption: [''], 
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
  
      // Assuming you want to initially display all data
      this.filteredData = this.data.slice(); 
  
      console.log('this.filteredData', this.filteredData);
    });
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
        this.loadData();
       
      },
      (error) => {
       
        console.error('Error submitting form:', error);
      }
    );


  }

  search() {
    this.filteredData = this.data.filter(item => {
      const searchInputLower = this.searchInput.toLowerCase();
  
      if (this.searchType === 'userId') {
        return item.post_user_id.toString().toLowerCase().includes(searchInputLower);
      } else if (this.searchType === 'postId') {
        return item.post_id.toString().toLowerCase().includes(searchInputLower);
      }
      return false;
    });
  }


  sort() {
    this.filteredData = this.data.slice(0); // Create a copy of the original data array

    // Sorting logic based on sortBy and sortOrder
    this.filteredData.sort((a, b) => {
      const aValue = this.sortBy === 'userId' ? a.post_user_id : a.post_id;
      const bValue = this.sortBy === 'userId' ? b.post_user_id : b.post_id;

      if (this.sortOrder === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });
  }

}
