import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const License = props => {

    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const classes = useStyles();

    return (
        <div className={classes.root}>
        <Grid container spacing={4}>
            <Grid item lg={12} md={12} xl={12} xs={12}>
            <Accordion expanded={expanded === 'react'} onChange={handleChange('react')}>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="reactbh-content"
                id="reactbh-header"
                >
                <Typography className={classes.heading}>react</Typography>
                </AccordionSummary>
                <AccordionDetails>
                <Typography>
                    MIT License
                    <br/><br/>
                    Copyright (c) Facebook, Inc. and its affiliates.
                    <br/><br/>
                    Permission is hereby granted, free of charge, to any person obtaining a copy
                    of this software and associated documentation files (the "Software"), to deal
                    in the Software without restriction, including without limitation the rights
                    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
                    copies of the Software, and to permit persons to whom the Software is
                    furnished to do so, subject to the following conditions:
                    <br/><br/>
                    The above copyright notice and this permission notice shall be included in all
                    copies or substantial portions of the Software.
                    <br/><br/>
                    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
                    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
                    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
                    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
                    SOFTWARE.
                </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'Nginx'} onChange={handleChange('Nginx')}>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="Nginxbh-content"
                id="Nginxbh-header"
                >
                <Typography className={classes.heading}>Nginx</Typography>
                </AccordionSummary>
                <AccordionDetails>
                <Typography>
                    Copyright (C) 2002-2020 Igor Sysoev
                    Copyright (C) 2011-2020 Nginx, Inc.
                    All rights reserved.
                    <br/><br/>
                    Redistribution and use in source and binary forms, with or without
                    modification, are permitted provided that the following conditions
                    are met:
                    <br/><br/>
                    1. Redistributions of source code must retain the above copyright
                       notice, this list of conditions and the following disclaimer.
                    <br/><br/>
                    2. Redistributions in binary form must reproduce the above copyright
                       notice, this list of conditions and the following disclaimer in the
                       documentation and/or other materials provided with the distribution.
                    <br/><br/>
                    THIS SOFTWARE IS PROVIDED BY THE AUTHOR AND CONTRIBUTORS ``AS IS'' AND
                    ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
                    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
                    ARE DISCLAIMED.  IN NO EVENT SHALL THE AUTHOR OR CONTRIBUTORS BE LIABLE
                    FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
                    DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
                    OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
                    HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
                    LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
                    OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
                    SUCH DAMAGE.
                    <br/><br/>
                </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'howler.js'} onChange={handleChange('howler.js')}>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="howler.jsbh-content"
                id="howler.jsbh-header"
                >
                <Typography className={classes.heading}>howler.js</Typography>
                </AccordionSummary>
                <AccordionDetails>
                <Typography>
                    The MIT License (MIT)
                    <br/><br/>
                    Copyright (c) 2013-2020 James Simpson and GoldFire Studios, Inc.
                    <br/>
                    <br/>
                    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
                    <br/>
                    <br/>
                    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
                    <br/>
                    <br/>
                    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
                </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'exceljs'} onChange={handleChange('exceljs')}>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="exceljsbh-content"
                id="exceljsbh-header"
                >
                <Typography className={classes.heading}>exceljs</Typography>
                </AccordionSummary>
                <AccordionDetails>
                <Typography>
                The MIT License (MIT)
                <br/><br/>
                Copyright (c) 2014-2019 Guyon Roche
                <br/><br/>
                Permission is hereby granted, free of charge, to any person obtaining a copy
                of this software and associated documentation files (the "Software"), to deal
                in the Software without restriction, including without limitation the rights
                to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
                copies of the Software, and to permit persons to whom the Software is
                furnished to do so, subject to the following conditions:
                <br/><br/>
                The above copyright notice and this permission notice shall be included in all
                copies or substantial portions of the Software.
                <br/><br/>
                THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
                AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
                LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
                OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
                SOFTWARE.
                </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'mqtt'} onChange={handleChange('mqtt')}>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="mqttbh-content"
                id="mqttbh-header"
                >
                <Typography className={classes.heading}>MQTT.js</Typography>
                </AccordionSummary>
                <AccordionDetails>
                <Typography>
                    The MIT License (MIT)
                    <br/><br/>
                    Copyright (c) 2015-2016 MQTT.js contributors
                    <br/><br/>
                    MQTT.js contributors listed at https://github.com/mqttjs/MQTT.js#contributors
                    <br/><br/>
                    Copyright 2011-2014 by Adam Rudd
                    <br/><br/>
                    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
                    <br/><br/>
                    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
                    <br/><br/>
                    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
                </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'axios'} onChange={handleChange('axios')}>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="axiosbh-content"
                id="axiosbh-header"
                >
                <Typography className={classes.heading}>axios</Typography>
                </AccordionSummary>
                <AccordionDetails>
                <Typography>
                    The MIT License (MIT)
                    <br/><br/>
                    Copyright (c) 2014-present Matt Zabriskie
                    <br/><br/>
                    Permission is hereby granted, free of charge, to any person obtaining a copy
                    of this software and associated documentation files (the "Software"), to deal
                    in the Software without restriction, including without limitation the rights
                    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
                    copies of the Software, and to permit persons to whom the Software is
                    furnished to do so, subject to the following conditions:
                    <br/><br/>
                    The above copyright notice and this permission notice shall be included in
                    all copies or substantial portions of the Software.
                    <br/><br/>
                    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
                    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
                    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
                    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
                    THE SOFTWARE.
                </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'chartjs'} onChange={handleChange('chartjs')}>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="chartjsbh-content"
                id="chartjsbh-header"
                >
                <Typography className={classes.heading}>Chart.js</Typography>
                </AccordionSummary>
                <AccordionDetails>
                <Typography>
                    The MIT License (MIT)
                    <br/><br/>
                    Copyright (c) 2018 Chart.js Contributors
                    <br/><br/>
                    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
                    <br/><br/>
                    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
                    <br/><br/>
                    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
                </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'material-ui'} onChange={handleChange('material-ui')}>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="material-uibh-content"
                id="material-uibh-header"
                >
                <Typography className={classes.heading}>material-ui</Typography>
                </AccordionSummary>
                <AccordionDetails>
                <Typography>
                    The MIT License (MIT)
                    <br/><br/>
                    Copyright (c) 2014 Call-Em-All
                    <br/><br/>
                    Permission is hereby granted, free of charge, to any person obtaining a copy
                    of this software and associated documentation files (the "Software"), to deal
                    in the Software without restriction, including without limitation the rights
                    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
                    copies of the Software, and to permit persons to whom the Software is
                    furnished to do so, subject to the following conditions:
                    <br/><br/>
                    The above copyright notice and this permission notice shall be included in all
                    copies or substantial portions of the Software.
                    <br/><br/>
                    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
                    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
                    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
                    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
                    SOFTWARE.
                </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'moment'} onChange={handleChange('moment')}>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="momentbh-content"
                id="momentbh-header"
                >
                <Typography className={classes.heading}>moment</Typography>
                </AccordionSummary>
                <AccordionDetails>
                <Typography>
                    The MIT License (MIT)
                    <br/><br/>
                    Copyright (c) JS Foundation and other contributors
                    <br/><br/>
                    Permission is hereby granted, free of charge, to any person
                    obtaining a copy of this software and associated documentation
                    files (the "Software"), to deal in the Software without
                    restriction, including without limitation the rights to use,
                    copy, modify, merge, publish, distribute, sublicense, and/or sell
                    copies of the Software, and to permit persons to whom the
                    Software is furnished to do so, subject to the following
                    conditions:
                    <br/><br/>
                    The above copyright notice and this permission notice shall be
                    included in all copies or substantial portions of the Software.
                    <br/><br/>
                    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
                    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
                    OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
                    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
                    HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
                    WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
                    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
                    OTHER DEALINGS IN THE SOFTWARE.
                </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'jwt-decode'} onChange={handleChange('jwt-decode')}>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="jwt-decodebh-content"
                id="jwt-decodebh-header"
                >
                <Typography className={classes.heading}>jwt-decode</Typography>
                </AccordionSummary>
                <AccordionDetails>
                <Typography>
                    The MIT License (MIT)
                    <br/><br/>
                    {"Copyright (c) 2015 Auth0, Inc. <support@auth0.com> (http://auth0.com)"}
                    <br/><br/>           
                    Permission is hereby granted, free of charge, to any person obtaining a copy
                    of this software and associated documentation files (the "Software"), to deal
                    in the Software without restriction, including without limitation the rights
                    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
                    copies of the Software, and to permit persons to whom the Software is
                    furnished to do so, subject to the following conditions:
                    <br/><br/>      
                    The above copyright notice and this permission notice shall be included in all
                    copies or substantial portions of the Software.
                    <br/><br/>  
                    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
                    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
                    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
                    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
                    SOFTWARE.
                </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'rsuite'} onChange={handleChange('rsuite')}>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="rsuitebh-content"
                id="rsuitebh-header"
                >
                <Typography className={classes.heading}>rsuite</Typography>
                </AccordionSummary>
                <AccordionDetails>
                <Typography>
                    The MIT License (MIT)
                    <br/><br/>
                    Copyright (c) HYPERS, Inc. and its affiliates.
                    <br/><br/>
                    Permission is hereby granted, free of charge, to any person obtaining a copy
                    of this software and associated documentation files (the "Software"), to deal
                    in the Software without restriction, including without limitation the rights
                    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
                    copies of the Software, and to permit persons to whom the Software is
                    furnished to do so, subject to the following conditions:
                    <br/><br/>
                    The above copyright notice and this permission notice shall be included in all
                    copies or substantial portions of the Software.
                    <br/><br/>
                    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
                    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
                    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
                    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
                    SOFTWARE.
                </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'notistack'} onChange={handleChange('notistack')}>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="notistackbh-content"
                id="notistackbh-header"
                >
                <Typography className={classes.heading}>notistack</Typography>
                </AccordionSummary>
                <AccordionDetails>
                <Typography>
                    Licensed under the MIT license
                    <br/><br/>
                    Copyright (c) © 2018-2020 Hossein Dehnokhalaji
                    <br/><br/>
                    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
                    <br/><br/>
                    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
                    <br/><br/>
                    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
                </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'FileSaver.js'} onChange={handleChange('FileSaver.js')}>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="FileSaver.jsbh-content"
                id="FileSaver.jsbh-header"
                >
                <Typography className={classes.heading}>FileSaver.js</Typography>
                </AccordionSummary>
                <AccordionDetails>
                <Typography>
                    The MIT License
                    <br/><br/>
                    Copyright © 2016 Eli Grey.
                    <br/><br/>
                    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
                    <br/><br/>
                    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
                    <br/><br/>
                    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
                </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'video.js'} onChange={handleChange('video.js')}>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="video.jsbh-content"
                id="video.jsbh-header"
                >
                <Typography className={classes.heading}>video.js</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Copyright Brightcove, Inc.
                        <br/><br/>
                        Licensed under the Apache License, Version 2.0 (the "License");
                        you may not use this file except in compliance with the License.
                        You may obtain a copy of the License at
                        <br/><br/>
                            http://www.apache.org/licenses/LICENSE-2.0
                            <br/><br/>
                        Unless required by applicable law or agreed to in writing, software
                        distributed under the License is distributed on an "AS IS" BASIS,
                        WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                        See the License for the specific language governing permissions and
                        limitations under the License.
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'js-base64'} onChange={handleChange('js-base64')}>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="js-base64bh-content"
                id="js-base64bh-header"
                >
                <Typography className={classes.heading}>js-base64</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                    Copyright (c) 2014, Dan Kogai All rights reserved.
                    <br/><br/>
                    Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
                    <br/><br/>
                    Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
                    <br/><br/>
                    Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
                    <br/><br/>
                    Neither the name of {"{{{project}}}"} nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
                    <br/><br/>
                    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
                    </Typography>
                </AccordionDetails>
            </Accordion>
            </Grid>
        </Grid>
        </div>
    );
};

export default License;
