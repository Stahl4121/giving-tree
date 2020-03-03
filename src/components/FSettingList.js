import React, { useEffect, Component } from 'react';

import { Button, Typography, Container, FormControl, InputLabel, Input, } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import TitleIcon from '@material-ui/icons/Title'
import PhoneIcon from '@material-ui/icons/Phone';
import HttpIcon from '@material-ui/icons/Http';
import EmailIcon from '@material-ui/icons/Email';
import ContactsIcon from '@material-ui/icons/Contacts';
import ContactsOutlinedIcon from '@material-ui/icons/ContactsOutlined';
import PhoneIphoneIcon from '@material-ui/icons/PhoneIphone';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';

export default function NonEditableData(props){
	return (
		<Container maxWidth="md">
			<Typography variant="h5">
				{props.name}
			</Typography>
			<List >
				<ListItem>
					<ListItemAvatar>
						<Avatar>
							<TitleIcon />
						</Avatar>
					</ListItemAvatar>
					<ListItemText primary="Foundation Name" secondary={props.cfInfo.name} />
				</ListItem>
				
				<ListItem>
					<ListItemAvatar>
						<Avatar>
							<EmailIcon />
						</Avatar>
					</ListItemAvatar>
					<ListItemText primary="Public Email" secondary={props.cfInfo.public_email} />
				</ListItem>
				
				<ListItem>
					<ListItemAvatar>
						<Avatar>
							<PhoneIcon />
						</Avatar>
					</ListItemAvatar>
					<ListItemText primary="Public Phone" secondary={props.cfInfo.public_phone} />
				</ListItem>
				
				<ListItem>
					<ListItemAvatar>
						<Avatar>
							<HttpIcon />
						</Avatar>
					</ListItemAvatar>
					<ListItemText primary="Foundation URL" secondary={props.cfInfo.foundation_url} />
				</ListItem>
				
				<ListItem>
					<ListItemAvatar>
						<Avatar>
							<ContactsIcon />
						</Avatar>
					</ListItemAvatar>
					<ListItemText primary="Contact First Name" secondary={props.cfInfo.fname_contact} />
				</ListItem>
				
				<ListItem>
					<ListItemAvatar>
						<Avatar>
							<ContactsOutlinedIcon />
						</Avatar>
					</ListItemAvatar>
					<ListItemText primary="Contact Last Name" secondary={props.cfInfo.lname_contact} />
				</ListItem>
				
				<ListItem>
					<ListItemAvatar>
						<Avatar>
							<AlternateEmailIcon />
						</Avatar>
					</ListItemAvatar>
					<ListItemText primary="Contact Email" secondary={props.cfInfo.personal_email} />
				</ListItem>
				
				<ListItem>
					<ListItemAvatar>
						<Avatar>
							<PhoneIphoneIcon />
						</Avatar>
					</ListItemAvatar>
					<ListItemText primary="Contact Phone" secondary={props.cfInfo.personal_phone} />
				</ListItem>
			</List>
			<Button onClick={props.toggleEdit}>Edit</Button>
		</Container>
	);
}