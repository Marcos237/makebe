import { Tooltip } from '@mui/material';
import { SocialIconItem } from '../Interfaces/shared/socialIconItem';

const SocialIcons: React.FC<{ props: SocialIconItem }> = ({ props }) => {
  return (
    <div className="social-icons">
      <Tooltip title="Login com Facebook">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
          alt="Facebook"
          width={props.width}
          height={props.height}
          style={{ cursor: 'pointer' }}
        />
      </Tooltip>

      <Tooltip title="Login com Instagram">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
          alt="Instagram"
          width={props.width}
          height={props.height}
          style={{ cursor: 'pointer', marginLeft: 10 }}
        />
      </Tooltip>

      <Tooltip title="Login com Google">
        <img
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="Google"
          width={props.width}
          height={props.height}
          style={{ cursor: 'pointer', marginLeft: 10 }}
        />
      </Tooltip>
    </div>
  );
};

export default SocialIcons;
