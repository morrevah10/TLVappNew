

export class Message {
    user_id!: string ;
    user_message!: string ;
    post_id!: string;
    date!: string;
    postDetails!:{
      post_street:string,
      post_city:string,
      confirmation_status:string,
      post_apartment_number:string,
      post_building_number:string,
    }
  showFullText!: boolean;
  isOpen!: boolean;
  read_status!: string;
message_id!:string;

  //   time!:string;
  //   post!: {
  //   post_id: string;
  //   post_city: string;
  //   post_street: string;
  //   post_bulding_number: string;
  // }; 
  }