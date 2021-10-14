import {useState, useEffect} from 'react'
import Drawer from '@mui/material/Drawer';
import {Button} from 'reactstrap'

export default NavBarDrawer=()=>{

    const[open, setOpen]=useState(false);

    return(
        <>
            <Button>Open Drawer</Button>
            <Drawer
                onClick={()=>setOpen(true)}
                open={open}
            >
                <div>Hello</div>
            </Drawer>
        </>
    )
    
}