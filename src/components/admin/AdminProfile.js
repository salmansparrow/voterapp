import { Card, CardBody, CardTitle, CardText } from "reactstrap";

const AdminProfile = ({ user }) => {
  return (
    <Card className="me-2">
      <CardBody>
        <CardTitle tag="h5">Admin Profile</CardTitle>
        <CardText>
          <strong>Email:</strong> {user.email}
        </CardText>
        {/* Add more profile details if needed */}
      </CardBody>
    </Card>
  );
};

export default AdminProfile;
